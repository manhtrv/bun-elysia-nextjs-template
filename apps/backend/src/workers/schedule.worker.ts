import type { Worker } from './index';
import { logger } from '@/utils/logger';
import { cron } from '@elysiajs/cron';

let cronPlugin: ReturnType<typeof cron> | null = null;

async function performScheduledTasks() {
  // Implement your scheduled tasks here
  logger.info('Performing scheduled tasks...');
  
  // Example: cleanup old records, send notifications, etc.
}

export const scheduleWorker: Worker = {
  name: 'ScheduleWorker',

  async start() {
    logger.info('Schedule worker starting...');
    
    // Create cron plugin for scheduled tasks
    cronPlugin = cron({
      name: 'scheduled-jobs',
      pattern: '*/5 * * * *', // Every 5 minutes
      run: async () => {
        logger.info('Running scheduled job');
        await performScheduledTasks();
      },
    });

    logger.info('Schedule worker started with cron jobs');
  },

  async stop() {
    if (cronPlugin) {
      cronPlugin = null;
    }
    logger.info('Schedule worker stopped');
  },
};
