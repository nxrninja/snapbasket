import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));




configDotenv();


const filePath = path.resolve(__dirname, '../MailTempletHtml/welcome.html');
const emailTemplate = fs.readFileSync(filePath, 'utf-8');
const compiledTemplate = handlebars.compile(emailTemplate);


// Redis connection with error handling
let connection = null;
try {
    connection = new IORedis({
        maxRetriesPerRequest: null,
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 3000);
            return delay;
        },
        enableOfflineQueue: false,
    });

    connection.on('error', (err) => {
        console.warn('Worker Redis connection error:', err.message);
    });
} catch (error) {
    console.error('Failed to create Redis connection for worker:', error.message);
    process.exit(1); // Worker needs Redis, so exit if unavailable
}


const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',     // ✅ use this, not titan.email
  port: 465,                       // ✅ SSL port
  secure: true,                   // ✅ because port 465 requires SSL
  auth: {
    user: process.env.EMAIL_USER, // no-reply@cloudcoderhub.in
    pass: process.env.EMAIL_PASS, // mailbox password
  },
});




const isValidEmail = (email) => {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


const worker = new Worker(
    'welcomeMessage',
    async (job) => {
        try {
           
            console.log(`Processing job ${job.id}`);

            
            const jobData = {
                fullname: job.data.data.fullname,
                email: job.data.data.email,
            };

            if (!jobData.email || !isValidEmail(jobData.email)) {
                throw new Error(`Invalid or missing email address in job ${job.id}: ${jobData.email}`);
            }

            
            const emailHtml = compiledTemplate(jobData);

            
            const mailOptions = {
                from: `"DevLoad" <${process.env.EMAIL_USER}>`,
                to: jobData.email,
                subject: 'Welcome to DevLode!',
                html: emailHtml,
            };

            
            await transporter.sendMail(mailOptions);
            console.log(`Welcome email sent successfully to ${jobData.email}`);
        } catch (error) {
            console.error(`Failed to send welcome email for job ${job.id}:`, error);
            throw error; 
        }
    },
    {
        connection,
        concurrency: 5,
        limiter: {
            max: 100,
            duration: 60 * 1000,
        },
    }
);


worker.on('failed', (job, error) => {
    console.error(`Job ${job.id} failed with data:`, JSON.stringify(job.data, null, 2), 'Error:', error);
});


worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed for email: ${job.data.data.email}`);
});


process.on('SIGTERM', async () => {
    await worker.close();
    console.log('Worker closed gracefully');
});