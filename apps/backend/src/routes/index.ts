import { Elysia } from 'elysia';

export const routes = new Elysia({ prefix: '/api' })
  .get('/', () => ({ message: 'API is running' }))
  .get('/ping', () => ({ message: 'pong' }));
