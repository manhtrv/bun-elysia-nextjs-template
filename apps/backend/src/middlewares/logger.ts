import { Elysia } from 'elysia';
import { logger as appLogger } from '@/utils/logger';

export const logger = new Elysia()
  .onBeforeHandle(({ request }) => {
    appLogger.info(`-> ${request.method} ${new URL(request.url).pathname}`);
  })
  .onAfterHandle(({ request, set }) => {
    appLogger.info(`<- ${request.method} ${new URL(request.url).pathname} ${set.status || 200}`);
  });
