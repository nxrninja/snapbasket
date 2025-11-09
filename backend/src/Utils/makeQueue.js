import { Queue } from "bullmq"
import IORedis from 'ioredis'


const connection = new IORedis({
    maxRetriesPerRequest: null,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

const makequeue  =  (queuename)=>{
    const queue = new Queue(`${queuename} , ${connection}`)
}

export {makequeue}