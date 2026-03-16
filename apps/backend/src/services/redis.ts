import Redis from 'ioredis';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError(err) {
    logger.error('Redis reconnect on error', { error: err.message });
    return true;
  },
});

redisClient.on('connect', () => {
  logger.info('Redis connected');
});

redisClient.on('error', (err) => {
  logger.error('Redis error', { error: err.message });
});

redisClient.on('close', () => {
  logger.warn('Redis connection closed');
});

export async function closeRedis() {
  await redisClient.quit();
  logger.info('Redis connection closed gracefully');
}

// Queue helpers
export async function enqueueJob(queueName: string, data: unknown) {
  await redisClient.rpush(queueName, JSON.stringify(data));
  logger.info(`Job enqueued to ${queueName}`, { data });
}

export async function getQueueLength(queueName: string): Promise<number> {
  return await redisClient.llen(queueName);
}
