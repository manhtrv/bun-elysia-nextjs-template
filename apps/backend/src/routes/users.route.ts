import { Elysia, t } from 'elysia';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { ApiResponse, User } from '@app/types';

export const usersRoute = new Elysia({ prefix: '/users' })
  .get('/', async () => {
    const allUsers = await db.select().from(users);
    
    const response: ApiResponse<User[]> = {
      success: true,
      data: allUsers.map(u => ({
        id: u.id,
        email: u.email,
        ...(u.name ? { name: u.name } : {}),
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      } as User)),
    };
    
    return response;
  })
  .get('/:id', async ({ params: { id }, set }) => {
    const user = await db.select().from(users).where(eq(users.id, parseInt(id))).limit(1);
    
    const foundUser = user[0];
    if (!foundUser) {
      set.status = 404;
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return response;
    }
    
    const response: ApiResponse<User> = {
      success: true,
      data: {
        id: foundUser.id,
        email: foundUser.email,
        ...(foundUser.name ? { name: foundUser.name } : {}),
        createdAt: foundUser.createdAt.toISOString(),
        updatedAt: foundUser.updatedAt.toISOString(),
      } as User,
    };
    
    return response;
  }, {
    params: t.Object({
      id: t.String(),
    }),
  })
  .post('/', async ({ body, set }) => {
    const result = await db.insert(users).values({
      email: body.email,
      name: body.name,
    }).returning();
    
    const newUser = result[0];
    if (!newUser) {
      set.status = 500;
      return {
        success: false,
        error: 'Failed to create user',
      };
    }
    
    set.status = 201;
    const response: ApiResponse<User> = {
      success: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        ...(newUser.name ? { name: newUser.name } : {}),
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString(),
      } as User,
      message: 'User created successfully',
    };
    
    return response;
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      name: t.Optional(t.String()),
    }),
  });
