const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
};

export type RunMode = 'api' | 'worker' | 'monolithic';

export const env = {
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  RUN_MODE: getEnv('RUN_MODE', 'monolithic') as RunMode,
  PORT: parseInt(getEnv('PORT', '3000'), 10),
  HOST: getEnv('HOST', '0.0.0.0'),
  DATABASE_URL: getEnv('DATABASE_URL'),
  REDIS_URL: getEnv('REDIS_URL', 'redis://localhost:6379'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:3001'),
};
