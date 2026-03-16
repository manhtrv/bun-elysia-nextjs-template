import type { Worker } from './index';
import { logger } from '@/utils/logger';
import { redisClient } from '@/services/redis';

const QUEUE_NAME = 'email:queue';

let isRunning = false;

async function processQueue() {
  while (isRunning) {
    try {
      const job = await redisClient.blpop(QUEUE_NAME, 5);
      
      if (job) {
        const [, data] = job;
        const emailJob = JSON.parse(data);
        
        logger.info('Processing email job', { emailJob });
        
        // Add your email sending logic here
        await sendEmail(emailJob);
        
        logger.info('Email job completed', { emailJob });
      }
    } catch (error) {
      logger.error('Error processing email queue', { error });
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

async function sendEmail(job: { to: string; subject: string; body: string; html?: string }) {
  // Implement email sending logic
  // This is a placeholder
  logger.info(`Sending email to ${job.to}`, { subject: job.subject });
}

export const emailWorker: Worker = {
  name: 'EmailWorker',

  async start() {
    logger.info('Email worker listening for jobs...');
    isRunning = true;
    // Process email queue in background
    processQueue();
  },

  async stop() {
    isRunning = false;
    logger.info('Email worker stopped');
  },
};
