# Bun + Elysia + Next.js Monorepo Template

A comprehensive full-stack TypeScript monorepo template using Bun runtime with configurable backend run modes.

## 🏗️ Architecture

### Monorepo Structure

```
.
├── apps/
│   ├── backend/          # Elysia.js API server
│   │   ├── src/
│   │   │   ├── core/     # Application core (app factory)
│   │   │   ├── config/   # Environment configuration
│   │   │   ├── db/       # Database schema & client
│   │   │   ├── routes/   # API routes
│   │   │   ├── workers/  # Background workers
│   │   │   ├── jobs/     # Job queue handlers
│   │   │   ├── services/ # Business services
│   │   │   ├── middlewares/ # Custom middlewares
│   │   │   └── utils/    # Utilities
│   │   └── index.ts      # Entry point with RUN_MODE support
│   └── frontend/         # Next.js application
│       └── src/
│           ├── app/      # Next.js App Router
│           ├── components/
│           └── lib/
└── packages/
    ├── config/           # Shared configuration
    ├── shared/           # Shared utilities & errors
    └── types/            # Shared TypeScript types

```

## 🚀 Run Modes

The backend supports three operational modes via the `RUN_MODE` environment variable:

### 1. API Mode (`RUN_MODE=api`)
- Runs only the HTTP API server
- Handles incoming requests
- No background workers
- Ideal for horizontal scaling of API instances

### 2. Worker Mode (`RUN_MODE=worker`)
- Runs only background workers
- Processes queued jobs (emails, scheduled tasks)
- No HTTP server
- Ideal for dedicated worker instances

### 3. Monolithic Mode (`RUN_MODE=monolithic`) - Default
- Runs both API server and workers
- All-in-one deployment
- Ideal for development and simple deployments

## 🛠️ Tech Stack

### Backend
- **Runtime**: Bun
- **Framework**: Elysia.js
- **Database**: PostgreSQL with Drizzle ORM
- **Cache/Queue**: Redis (ioredis)
- **Authentication**: JWT (@elysiajs/jwt)
- **Background Jobs**: Custom worker system with cron support

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS, Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Authentication**: NextAuth.js

## 📦 Getting Started

### Prerequisites
- Bun >= 1.3.3
- PostgreSQL
- Redis

### Installation

```bash
# Install dependencies
bun install

# Copy environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Update environment variables in .env files
```

### Development

```bash
# Run all apps in development mode
bun dev

# Run specific apps
bun backend:dev    # Backend only
bun frontend:dev   # Frontend only

# Database commands
cd apps/backend
bun db:generate    # Generate migrations
bun db:push        # Push schema to database
bun db:studio      # Open Drizzle Studio
```

### Production with Docker

```bash
# Start all services (API + Worker + PostgreSQL + Redis)
docker-compose up -d

# Scale API instances
docker-compose up -d --scale api=3

# View logs
docker-compose logs -f api
docker-compose logs -f worker
```

## 🏃 Running Different Modes

### Local Development

```bash
# API mode only
RUN_MODE=api bun backend:dev

# Worker mode only
RUN_MODE=worker bun backend:dev

# Monolithic mode (default)
RUN_MODE=monolithic bun backend:dev
# or simply
bun backend:dev
```

### Docker Deployment

The `docker-compose.yml` includes separate services for API and Worker modes:
- `api` service runs in API mode
- `worker` service runs in Worker mode
- Both share the same PostgreSQL and Redis instances

## 📚 Project Scripts

### Root Level
- `bun dev` - Run all apps in dev mode
- `bun build` - Build all apps
- `bun lint` - Lint all workspaces
- `bun type-check` - Type check all workspaces
- `bun test` - Run all tests
- `bun clean` - Clean all dependencies and build artifacts

### Backend
- `bun dev` - Development mode with watch
- `bun build` - Build for production
- `bun start` - Run production build
- `bun test` - Run tests
- `bun db:generate` - Generate database migrations
- `bun db:push` - Push schema to database
- `bun db:studio` - Open Drizzle Studio

### Frontend
- `bun dev` - Development server (port 3001)
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Lint frontend code

## 🔧 Configuration

### Environment Variables

#### Backend (`apps/backend/.env`)
```env
NODE_ENV=development
RUN_MODE=monolithic        # api | worker | monolithic
PORT=3000
HOST=0.0.0.0
DATABASE_URL=postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/YOUR_DB_NAME
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3001
```

#### Frontend (`apps/frontend/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3001
```

## 🏗️ Key Features

### Backend Features
- ✅ Multi-mode deployment (API/Worker/Monolithic)
- ✅ Type-safe API with Elysia.js
- ✅ PostgreSQL with Drizzle ORM
- ✅ Redis for caching and job queues
- ✅ Background workers with job processing
- ✅ Scheduled tasks with cron
- ✅ JWT authentication
- ✅ Error handling middleware
- ✅ Request logging
- ✅ Health check endpoint
- ✅ Graceful shutdown

### Frontend Features
- ✅ Next.js App Router
- ✅ Server and Client Components
- ✅ Tailwind CSS + Radix UI components
- ✅ NextAuth.js authentication
- ✅ TanStack Query for data fetching
- ✅ Zustand for state management
- ✅ Type-safe API client

### Shared Packages
- ✅ Common TypeScript types
- ✅ Shared utilities and constants
- ✅ Custom error classes
- ✅ Configuration presets

## 📖 API Documentation

### Health Check
```bash
GET /health
Response: { status: "ok", timestamp: "...", mode: "monolithic" }
```

### Users API
```bash
# Get all users
GET /api/users

# Get user by ID
GET /api/users/:id

# Create user
POST /api/users
Body: { email: "user@example.com", name: "User Name" }
```

## 🧪 Testing

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run with coverage
bun test:coverage
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
