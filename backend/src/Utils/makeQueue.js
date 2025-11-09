import { Queue } from "bullmq"
import IORedis from 'ioredis'

// Lazy Redis connection - only create when needed
let connection = null;

const getRedisConnection = () => {
    if (!connection) {
        const redisHost = process.env.REDIS_HOST || 'localhost';
        const redisPort = process.env.REDIS_PORT || 6379;
        
        try {
            connection = new IORedis({
                maxRetriesPerRequest: null,
                host: redisHost,
                port: parseInt(redisPort),
                retryStrategy: (times) => {
                    // Retry with exponential backoff, max 3 seconds
                    const delay = Math.min(times * 50, 3000);
                    console.log(`Redis connection retry attempt ${times}, waiting ${delay}ms`);
                    return delay;
                },
                reconnectOnError: (err) => {
                    const targetError = 'READONLY';
                    if (err.message.includes(targetError)) {
                        return true; // Reconnect on READONLY error
                    }
                    return false;
                },
                enableOfflineQueue: false, // Don't queue commands when offline
            });

            connection.on('error', (err) => {
                console.warn('Redis connection error:', err.message);
                // Don't crash - just log the error
            });

            connection.on('connect', () => {
                console.log('Redis connected successfully');
            });
        } catch (error) {
            console.warn('Failed to create Redis connection:', error.message);
            console.warn('Server will continue without Redis');
            return null;
        }
    }
    return connection;
};

const makequeue = (queuename) => {
    try {
        const redisConnection = getRedisConnection();
        if (!redisConnection) {
            console.warn(`Queue ${queuename} not created - Redis unavailable`);
            return null;
        }
        const queue = new Queue(queuename, { connection: redisConnection });
        return queue;
    } catch (error) {
        console.error(`Failed to create queue ${queuename}:`, error.message);
        return null;
    }
}

export { makequeue, getRedisConnection }