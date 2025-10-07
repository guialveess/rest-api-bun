export interface PaginationOptions {
  page: number
  limit: number
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SortOptions {
  field: string
  order: 'asc' | 'desc'
}

export interface FilterOptions {
  search?: string
  status?: string
  userId?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    timestamp: string
    requestId?: string
  }
}

export interface ErrorDetails {
  field?: string
  message: string
  code?: string
}