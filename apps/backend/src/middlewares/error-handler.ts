import { Elysia } from 'elysia';
import { logger } from '@/utils/logger';

export const errorHandler = new Elysia()
  .onError(({ code, error, set }) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    logger.error(`[${code}] ${errorMessage}`, { stack: errorStack });

    switch (code) {
      case 'VALIDATION':
        set.status = 400;
        return {
          success: false,
          error: 'Validation error',
          message: errorMessage,
        };
      case 'NOT_FOUND':
        set.status = 404;
        return {
          success: false,
          error: 'Not found',
          message: errorMessage,
        };
      case 'PARSE':
        set.status = 400;
        return {
          success: false,
          error: 'Parse error',
          message: 'Invalid request format',
        };
      case 'INTERNAL_SERVER_ERROR':
        set.status = 500;
        return {
          success: false,
          error: 'Internal server error',
          message: 'An unexpected error occurred',
        };
      default:
        set.status = 500;
        return {
          success: false,
          error: 'Unknown error',
          message: errorMessage,
        };
    }
  });
