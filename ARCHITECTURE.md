# Architecture Documentation

## Overview

This is a comprehensive full-stack TypeScript monorepo built with Bun runtime, featuring a configurable backend that supports multiple deployment modes.

## Monorepo Structure

```
bun-elysia-nextjs-template/
├── apps/
│   ├── backend/              # Elysia.js API server with multi-mode support
│   │   ├── src/
│   │   │   ├── core/         # Application factory and core setup
│   │   │   │   └── app.ts    # Elysia app factory
│   │   │   ├── config/       # Environment configuration
│   │   │   │   └── env.ts    # Environment variables with RUN_MODE
│   │   │   ├── db/           # Database layer
│   │   │   │   ├── index.ts  # Drizzle client
│   │   │   │   └── schema.ts # Database schemas
│   │   │   ├── routes/       # API route handlers
│   │   │   │   ├── index.ts  # Route aggregator
│   │   │   │   └── users.route.ts # User endpoints
│   │   │   ├── workers/      # Background worker processes
│   │   │   │   ├── index.ts  # Worker orchestrator
│   │   │   │   ├── email.worker.ts    # Email queue processor
│   │   │   │   └── schedule.worker.ts # Cron jobs
│   │   │   ├── jobs/         # Job queue definitions
│   │   │   │   └── index.ts  # Job enqueuers
│   │   │   ├── services/     # Business services
│   │   │   │   ├── index.ts  # Service exports
│   │   │   │   └── redis.ts  # Redis client & queue helpers
│   │   │   ├── middlewares/  # Custom middlewares
│   │   │   │   ├── error-handler.ts # Global error handler
│   │   │   │   └── logger.ts        # Request logger
│   │   │   └── utils/        # Utility functions
│   │   │       └── logger.ts # Application logger
│   │   └── index.ts          # Entry point with mode switching
│   └── frontend/             # Next.js 14 application
│       └── src/
│           ├── app/          # Next.js App Router
│           ├── components/   # React components
│           └── lib/          # Frontend libraries
└── packages/
    ├── config/               # Shared configuration constants
    │   └── src/
    │       └── index.ts      # API, cache, queue configs
    ├── shared/               # Shared utilities
    │   └── src/
    │       ├── constants.ts  # App constants
    │       ├── utils.ts      # Utility functions
    │       └── errors.ts     # Custom error classes
    └── types/                # Shared TypeScript types
        └── src/
            └── index.ts      # Common type definitions
```

## Backend Run Modes

### Environment Variable: `RUN_MODE`

The backend can operate in three distinct modes:

#### 1. API Mode (`RUN_MODE=api`)

**Purpose**: HTTP API server only

**What runs**:
- ✅ Elysia HTTP server
- ✅ API routes (`/api/*`)
- ✅ Health check endpoint
- ✅ Middlewares (CORS, authentication, logging)
- ❌ Background workers
- ❌ Scheduled tasks

**Use cases**:
- Horizontally scalable API instances
- Dedicated API layer in microservices
- High-traffic scenarios requiring multiple API servers

**Docker deployment**:
```yaml
api:
  environment:
    RUN_MODE: api
  ports:
    - "3000:3000"
```

#### 2. Worker Mode (`RUN_MODE=worker`)

**Purpose**: Background job processing only

**What runs**:
- ❌ HTTP server
- ✅ Email worker (processes email queue)
- ✅ Schedule worker (cron jobs)
- ✅ Redis queue consumers

**Use cases**:
- Dedicated worker instances
- Asynchronous job processing
- Resource-intensive background tasks
- Independent worker scaling

**Docker deployment**:
```yaml
worker:
  environment:
    RUN_MODE: worker
  # No port mapping needed
```

#### 3. Monolithic Mode (`RUN_MODE=monolithic`) - Default

**Purpose**: All-in-one deployment

**What runs**:
- ✅ Elysia HTTP server
- ✅ API routes
- ✅ All background workers
- ✅ Scheduled tasks

**Use cases**:
- Development environment
- Small to medium deployments
- Single-server setups
- Simplified deployment

**Docker deployment**:
```yaml
app:
  environment:
    RUN_MODE: monolithic
  ports:
    - "3000:3000"
```

## Key Components

### 1. Core Application Factory (`src/core/app.ts`)

Creates the Elysia application instance with all plugins and middlewares:

```typescript
export function createApp() {
  return new Elysia()
    .use(logger)           // Request logging
    .use(errorHandler)     // Global error handling
    .use(cors())           // CORS configuration
    .use(bearer())         // Bearer token support
    .get('/health', ...)   // Health check
    .use(routes);          // API routes
}
```

### 2. Worker System (`src/workers/`)

**Worker Interface**:
```typescript
interface Worker {
  name: string;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}
```

**Available Workers**:

- **EmailWorker**: Processes email queue from Redis
  - Queue: `email:queue`
  - Uses Redis BLPOP for blocking queue consumption
  - Graceful shutdown support

- **ScheduleWorker**: Runs scheduled tasks via cron
  - Pattern: `*/5 * * * *` (every 5 minutes)
  - Uses `@elysiajs/cron` plugin
  - Configurable cron patterns

### 3. Job Queue System (`src/jobs/`)

**Enqueue jobs for async processing**:

```typescript
import { sendEmail } from '@/jobs';

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome',
  body: 'Hello!',
});
```

Jobs are pushed to Redis queues and processed by workers.

### 4. Middleware Stack

**Error Handler** (`middlewares/error-handler.ts`):
- Catches all errors
- Maps error codes to HTTP statuses
- Returns standardized error responses
- Logs errors with stack traces

**Logger Middleware** (`middlewares/logger.ts`):
- Logs all incoming requests
- Logs responses with status codes
- Uses centralized logger utility

### 5. Services Layer

**Redis Service** (`services/redis.ts`):
- Singleton Redis client
- Connection management with retry logic
- Queue helper functions:
  - `enqueueJob(queueName, data)` - Add job to queue
  - `getQueueLength(queueName)` - Get queue size

### 6. Shared Packages

**@app/types**:
- Common TypeScript interfaces
- `User`, `ApiResponse<T>`

**@app/shared**:
- Utility functions (`formatDate`, `capitalize`)
- Custom error classes (`ValidationError`, `NotFoundError`, etc.)
- App constants

**@app/config**:
- API configuration
- Cache TTL settings
- Queue names
- Pagination defaults

## API Routes

### Health Check
```
GET /health
Response: { status: "ok", timestamp: "...", mode: "monolithic" }
```

### Users API
```
GET    /api/users       # List all users
GET    /api/users/:id   # Get user by ID
POST   /api/users       # Create user
```

**Request/Response Format**:
```typescript
// Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## Environment Configuration

### Backend (.env)
```env
NODE_ENV=development|production
RUN_MODE=api|worker|monolithic

# Server
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_DB_HOST:5432/YOUR_DB_NAME

# Redis
REDIS_URL=redis://hostname:6379

# Authentication
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3001
```

## Deployment Strategies

### Development
```bash
# Single process (monolithic)
RUN_MODE=monolithic bun dev
```

### Production - Monolithic
```bash
docker-compose up
# Single container runs both API and workers
```

### Production - Microservices
```bash
# Scale API instances
docker-compose up --scale api=3

# Separate worker instances
docker-compose up --scale worker=2
```

### Production - Manual
```bash
# Terminal 1: API Server
RUN_MODE=api bun start

# Terminal 2: Worker Process
RUN_MODE=worker bun start

# Terminal 3: Another API instance
RUN_MODE=api PORT=3001 bun start
```

## Graceful Shutdown

The application handles `SIGTERM` and `SIGINT` signals:

1. Stops all workers gracefully
2. Closes Redis connection
3. Allows in-flight requests to complete
4. Exits cleanly

```typescript
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

## Technology Stack

### Backend
- **Runtime**: Bun 1.3.3+
- **Framework**: Elysia.js 1.4
- **Database**: PostgreSQL + Drizzle ORM
- **Cache/Queue**: Redis (ioredis)
- **Authentication**: JWT (@elysiajs/jwt)
- **Scheduling**: @elysiajs/cron

### Frontend
- **Framework**: Next.js 14
- **UI**: Tailwind CSS, Radix UI
- **State**: Zustand
- **Data Fetching**: TanStack Query
- **Auth**: NextAuth.js

## Best Practices

### Adding New Workers

1. Create worker file in `src/workers/`:
```typescript
import type { Worker } from './index';

export const myWorker: Worker = {
  name: 'MyWorker',
  async start() {
    // Initialize worker
  },
  async stop() {
    // Cleanup
  },
};
```

2. Register in `src/workers/index.ts`:
```typescript
import { myWorker } from './my.worker';

const workers: Worker[] = [
  emailWorker,
  scheduleWorker,
  myWorker, // Add here
];
```

### Adding New API Routes

1. Create route file in `src/routes/`:
```typescript
import { Elysia } from 'elysia';

export const myRoute = new Elysia({ prefix: '/my-resource' })
  .get('/', () => ({ message: 'Hello' }));
```

2. Register in `src/routes/index.ts`:
```typescript
import { myRoute } from './my.route';

export const routes = new Elysia({ prefix: '/api' })
  .use(usersRoute)
  .use(myRoute); // Add here
```

### Adding New Jobs

1. Define job interface in `src/jobs/index.ts`:
```typescript
export interface MyJob {
  data: string;
}

export async function enqueueMyJob(data: MyJob) {
  await enqueueJob('my-job:queue', data);
}
```

2. Create worker to process it in `src/workers/`.

## Monitoring and Observability

### Health Checks
- **Endpoint**: `GET /health`
- **Response**: Includes current run mode
- **Docker**: Health check configured in docker-compose.yml

### Logging
- Centralized logger in `src/utils/logger.ts`
- Request/response logging via middleware
- Error logging with stack traces
- Structured logging for queue jobs

### Metrics to Monitor
- API response times
- Queue lengths (`getQueueLength()`)
- Worker processing rates
- Error rates by endpoint
- Database connection pool

## Troubleshooting

### Workers not processing jobs
1. Check `RUN_MODE` is `worker` or `monolithic`
2. Verify Redis connection
3. Check queue has items: `getQueueLength('email:queue')`
4. Review worker logs

### Database connection errors
1. Verify `DATABASE_URL` is correct
2. Check PostgreSQL is running
3. Ensure database exists
4. Check network connectivity

### Type errors after changes
```bash
bun type-check  # Check all workspaces
bun lint        # Check code style
```
