type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    log('info', message, meta);
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    log('warn', message, meta);
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    log('error', message, meta);
  },
  debug: (message: string, meta?: Record<string, unknown>) => {
    log('debug', message, meta);
  },
};

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    level,
    message,
    ...(meta && { meta }),
  };
  console.log(JSON.stringify(logData));
}
