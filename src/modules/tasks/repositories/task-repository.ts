import { prisma } from '@/lib/database.js'
import { Task, User } from '@prisma/client'
import { BaseRepository } from '@/lib/base-repository.js'
import { CreateTaskInput, UpdateTaskInput, ListTasksQuery } from '@/schemas/index.js'

export interface TaskWithUser extends Task {
  user: {
    id: string
    name: string
    email: string
  }
}

export class TaskRepository extends BaseRepository<TaskWithUser, CreateTaskInput, UpdateTaskInput> {
  protected model = prisma.task

  protected buildSearchClause(search: string): any[] {
    return [
      { title: { contains: search, mode: 'insensitive' as const } },
      { description: { contains: search, mode: 'insensitive' as const } },
      { user: { name: { contains: search, mode: 'insensitive' as const } } },
      { user: { email: { contains: search, mode: 'insensitive' as const } } }
    ]
  }

  async findById(id: string): Promise<TaskWithUser | null> {
    return this.model.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  async findAll(query: ListTasksQuery) {
    const { page, limit, search, status, userId, sortBy, sortOrder, dateFrom, dateTo } = query
    
    const skip = (page - 1) * limit
    
    const [data, total] = await Promise.all([
      this.model.findMany({
        where: this.buildWhereClause({ 
          search, 
          status, 
          userId,
          dateFrom: dateFrom ? new Date(dateFrom) : undefined,
          dateTo: dateTo ? new Date(dateTo) : undefined
        }),
        orderBy: this.buildOrderClause({ field: sortBy, order: sortOrder }),
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      this.model.count({
        where: this.buildWhereClause({ 
          search, 
          status, 
          userId,
          dateFrom: dateFrom ? new Date(dateFrom) : undefined,
          dateTo: dateTo ? new Date(dateTo) : undefined
        })
      })
    ])

    return this.createPaginationResult(data, total, { page, limit })
  }

  async create(data: CreateTaskInput): Promise<TaskWithUser> {
    return this.model.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  async update(id: string, data: UpdateTaskInput): Promise<TaskWithUser> {
    return this.model.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  async delete(id: string): Promise<TaskWithUser> {
    return this.model.delete({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  async findByUserId(userId: string): Promise<TaskWithUser[]> {
    return this.model.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async countByStatus(status: string): Promise<number> {
    return this.model.count({
      where: { status: status as any }
    })
  }
}