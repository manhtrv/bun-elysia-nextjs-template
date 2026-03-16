import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import { createApp } from '@/core/app';
import { startWorkers, stopWorkers } from '@/workers';
import { closeRedis } from '@/services/redis';

async function startApiMode() {
  const app = createApp();
  app.listen(env.PORT);
  logger.info(`🦊 API Server is running at http://${app.server?.hostname}:${app.server?.port}`);
  return app;
}

async function startWorkerMode() {
  logger.info('🔧 Starting in WORKER mode');
  await startWorkers();
  logger.info('✅ All workers are running');
}

async function startMonolithicMode() {
  logger.info('🚀 Starting in MONOLITHIC mode');
  
  // Start API server
  const app = await startApiMode();
  
  // Start workers
  await startWorkers();
  
  logger.info('✅ Monolithic application is fully running');
  return app;
}

async function main() {
  logger.info(`Starting application in ${env.RUN_MODE} mode...`);
  
  try {
    switch (env.RUN_MODE) {
      case 'api':
        await startApiMode();
        break;
      case 'worker':
        await startWorkerMode();
        break;
      case 'monolithic':
        await startMonolithicMode();
        break;
      default:
        throw new Error(`Unknown RUN_MODE: ${env.RUN_MODE}`);
    }
  } catch (error) {
    logger.error('Failed to start application', { error });
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  
  if (env.RUN_MODE === 'worker' || env.RUN_MODE === 'monolithic') {
    await stopWorkers();
  }
  
  await closeRedis();
  
  logger.info('Shutdown complete');
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

main();

export type { App } from '@/core/app';
