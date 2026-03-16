import { logger } from '@/utils/logger';
import { emailWorker } from './email.worker';
import { scheduleWorker } from './schedule.worker';

export interface Worker {
  name: string;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

const workers: Worker[] = [
  emailWorker,
  scheduleWorker,
];

export async function startWorkers() {
  logger.info('Starting workers...');
  
  for (const worker of workers) {
    try {
      await worker.start();
      logger.info(`Worker "${worker.name}" started successfully`);
    } catch (error) {
      logger.error(`Failed to start worker "${worker.name}"`, { error });
      throw error;
    }
  }
  
  logger.info(`All ${workers.length} workers started`);
}

export async function stopWorkers() {
  logger.info('Stopping workers...');
  
  for (const worker of workers) {
    try {
      await worker.stop();
      logger.info(`Worker "${worker.name}" stopped`);
    } catch (error) {
      logger.error(`Failed to stop worker "${worker.name}"`, { error });
    }
  }
  
  logger.info('All workers stopped');
}
