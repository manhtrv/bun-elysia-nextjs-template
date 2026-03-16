import { Elysia } from 'elysia';
import { usersRoute } from './users.route';

export const routes = new Elysia({ prefix: '/api' })
  .get('/', () => ({ message: 'API is running' }))
  .get('/ping', () => ({ message: 'pong' }))
  .use(usersRoute);
