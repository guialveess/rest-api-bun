import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

export const globalMiddleware = new Elysia({ name: 'global-middleware' })
  .use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
  }))
  .derive(({ request }) => {
    const requestId = crypto.randomUUID()
    
    console.log(`${request.method} ${request.url}`, {
      requestId,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    })

    return {
      requestId
    }
  })
  .onBeforeHandle(({ set, requestId }) => {
    set.headers['X-Request-ID'] = requestId
    set.headers['Content-Type'] = 'application/json'
  })
  .onAfterHandle(({ request, set }) => {
    const responseTime = Date.now()
    console.log(`Response sent for ${request.method} ${request.url}`, {
      responseTime,
      timestamp: new Date().toISOString()
    })
  })