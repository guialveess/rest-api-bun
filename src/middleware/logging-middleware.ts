import { Elysia } from 'elysia'
import { logger } from '@bogeychan/elysia-logger'

export const loggingMiddleware = new Elysia({ name: 'logging-middleware' })
  .use(logger({
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }))
  .onRequest(({ request, logger }) => {
    logger.info({
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    }, 'Incoming request')
  })
  .onResponse(({ request, set, logger }) => {
    logger.info({
      method: request.method,
      url: request.url,
      status: set.status,
      responseTime: Date.now(),
      timestamp: new Date().toISOString()
    }, 'Request completed')
  })
  .onError(({ error, logger }) => {
    logger.error({
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, 'Request failed')
  })