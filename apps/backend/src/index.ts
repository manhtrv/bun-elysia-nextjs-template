import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { bearer } from '@elysiajs/bearer';
import { env } from '@/config/env';
import { routes } from '@/routes';

const app = new Elysia()
  .use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    })
  )
  .use(bearer())
  .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
  .use(routes)
  .listen(env.PORT);

console.log(`🦊 Server is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
