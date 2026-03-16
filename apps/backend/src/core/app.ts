import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { bearer } from '@elysiajs/bearer';
import { env } from '@/config/env';
import { routes } from '@/routes';
import { errorHandler } from '@/middlewares/error-handler';
import { logger } from '@/middlewares/logger';

export function createApp() {
  const app = new Elysia()
    .use(logger)
    .use(errorHandler)
    .use(
      cors({
        origin: env.FRONTEND_URL,
        credentials: true,
      })
    )
    .use(bearer())
    .get('/health', () => ({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      mode: env.RUN_MODE,
    }))
    .use(routes);

  return app;
}

export type App = ReturnType<typeof createApp>;
