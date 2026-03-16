export const config = {
  api: {
    prefix: '/api',
    version: 'v1',
    timeout: 30000,
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  cache: {
    ttl: {
      short: 60,       // 1 minute
      medium: 300,     // 5 minutes
      long: 3600,      // 1 hour
      day: 86400,      // 24 hours
    },
  },
  queue: {
    email: 'email:queue',
    notification: 'notification:queue',
  },
};
