import { prisma } from '@/lib/database.js'
import { User } from '@prisma/client'
import { BaseRepository } from '@/lib/base-repository.js'
import { CreateUserInput, UpdateUserInput, ListUsersQuery } from '@/schemas/index.js'

export class UserRepository extends BaseRepository<User, CreateUserInput, UpdateUserInput> {
  protected model = prisma.user

  protected buildSearchClause(search: string): any[] {
    return [
      { name: { contains: search, mode: 'insensitive' as const } },
      { email: { contains: search, mode: 'insensitive' as const } }
    ]
  }

  async findAll(query: ListUsersQuery) {
    const { page, limit, search, sortBy, sortOrder } = query
    
    const skip = (page - 1) * limit
    
    const [data, total] = await Promise.all([
      this.model.findMany({
        where: this.buildWhereClause({ search }),
        orderBy: this.buildOrderClause({ field: sortBy, order: sortOrder }),
        skip,
        take: limit,
        include: {
          tasks: {
            select: {
              id: true,
              title: true,
              status: true,
              createdAt: true
            }
          }
        }
      }),
      this.model.count({
        where: this.buildWhereClause({ search })
      })
    ])

    return this.createPaginationResult(data, total, { page, limit })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
      include: {
        tasks: true
      }
    })
  }

  async delete(id: string): Promise<User> {
    return this.model.delete({
      where: { id },
      include: {
        tasks: true
      }
    })
  }
}