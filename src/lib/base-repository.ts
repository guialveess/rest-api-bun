import { PaginationOptions, PaginationResult, SortOptions, FilterOptions } from '@/types/index.js'

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected abstract model: any

  protected createPaginationResult(
    data: T[],
    total: number,
    options: PaginationOptions
  ): PaginationResult<T> {
    const totalPages = Math.ceil(total / options.limit)
    
    return {
      data,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages,
        hasNext: options.page < totalPages,
        hasPrev: options.page > 1
      }
    }
  }

  protected buildWhereClause(filters: FilterOptions): any {
    const where: any = {}

    if (filters.search) {
      where.OR = this.buildSearchClause(filters.search)
    }

    if (filters.userId) {
      where.userId = filters.userId
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {}
      if (filters.dateFrom) {
        where.createdAt.gte = filters.dateFrom
      }
      if (filters.dateTo) {
        where.createdAt.lte = filters.dateTo
      }
    }

    return where
  }

  protected abstract buildSearchClause(search: string): any

  protected buildOrderClause(sort: SortOptions): any {
    return {
      [sort.field]: sort.order
    }
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id }
    })
  }

  async create(data: CreateInput): Promise<T> {
    return this.model.create({
      data
    })
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    return this.model.update({
      where: { id },
      data
    })
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id }
    })
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.model.count({
      where: { id }
    })
    return count > 0
  }
}