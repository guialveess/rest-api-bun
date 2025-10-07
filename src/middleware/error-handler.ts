import { Elysia } from 'elysia'
import { ApiResponse, ErrorDetails } from '@/types/index.js'

export const errorHandler = new Elysia({ name: 'error-handler' })
  .onError(({ code, error, set }) => {
    console.error('Error occurred:', { code, error: error.message, stack: error.stack })

    if (code === 'VALIDATION') {
      const validationErrors: ErrorDetails[] = []
      
      if (error.type === 'validation') {
        for (const [field, issues] of Object.entries(error.errors)) {
          validationErrors.push({
            field,
            message: Array.isArray(issues) ? issues[0] : String(issues),
            code: 'VALIDATION_ERROR'
          })
        }
      }

      set.status = 400
      return {
        success: false,
        error: 'Validation failed',
        details: validationErrors,
        meta: {
          timestamp: new Date().toISOString()
        }
      } as ApiResponse
    }

    if (error.message.includes('not found')) {
      set.status = 404
      return {
        success: false,
        error: error.message,
        code: 'NOT_FOUND',
        meta: {
          timestamp: new Date().toISOString()
        }
      } as ApiResponse
    }

    if (error.message.includes('already exists')) {
      set.status = 409
      return {
        success: false,
        error: error.message,
        code: 'CONFLICT',
        meta: {
          timestamp: new Date().toISOString()
        }
      } as ApiResponse
    }

    if (error.message.includes('Invalid')) {
      set.status = 400
      return {
        success: false,
        error: error.message,
        code: 'BAD_REQUEST',
        meta: {
          timestamp: new Date().toISOString()
        }
      } as ApiResponse
    }

    set.status = 500
    return {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      meta: {
        timestamp: new Date().toISOString()
      }
    } as ApiResponse
  })