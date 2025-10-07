import { Elysia } from 'elysia'
import { UserService } from '../useCases/user-service.js'
import { 
  createUserSchema, 
  updateUserSchema, 
  userIdSchema, 
  listUsersQuerySchema 
} from '@/schemas/index.js'

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  private createResponse(data: any, message?: string) {
    return {
      success: true,
      data,
      ...(message && { message }),
      meta: {
        timestamp: new Date().toISOString()
      }
    }
  }

  getRoutes() {
    return new Elysia({ prefix: '/users' })
      .decorate('userService', this.userService)
      .get(
        '/',
        async ({ query, userService }) => {
          const result = await userService.getAllUsers(query)
          return {
            ...this.createResponse(result.data),
            pagination: result.pagination
          }
        },
        {
          query: listUsersQuerySchema,
          detail: {
            summary: 'Listar todos os usuários',
            description: 'Retorna uma lista paginada de usuários com filtros opcionais de busca por nome/email, ordenação e paginação',
            tags: ['Users'],
            responses: {
              200: {
                description: 'Lista de usuários retornada com sucesso',
                content: {
                  'application/json': {
                    example: {
                      success: true,
                      data: [
                        {
                          id: '550e8400-e29b-41d4-a716-446655440000',
                          name: 'João Silva',
                          email: 'joao.silva@email.com',
                          createdAt: '2024-01-15T10:30:00.000Z',
                          updatedAt: '2024-01-15T10:30:00.000Z'
                        },
                        {
                          id: '550e8400-e29b-41d4-a716-446655440001',
                          name: 'Maria Santos',
                          email: 'maria.santos@email.com',
                          createdAt: '2024-01-15T11:00:00.000Z',
                          updatedAt: '2024-01-15T11:00:00.000Z'
                        }
                      ],
                      pagination: {
                        page: 1,
                        limit: 10,
                        total: 2,
                        totalPages: 1,
                        hasNext: false,
                        hasPrev: false
                      },
                      meta: {
                        timestamp: '2024-01-15T12:00:00.000Z'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      )
      .get(
        '/:id',
        async ({ params, userService }) => {
          const user = await userService.getUserById(params.id)
          return this.createResponse(user)
        },
        {
          params: userIdSchema,
          detail: {
            summary: 'Buscar usuário por ID',
            description: 'Retorna os dados completos de um usuário específico pelo ID',
            tags: ['Users'],
            responses: {
              200: {
                description: 'Usuário encontrado com sucesso',
                content: {
                  'application/json': {
                    example: {
                      success: true,
                      data: {
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        name: 'João Silva',
                        email: 'joao.silva@email.com',
                        createdAt: '2024-01-15T10:30:00.000Z',
                        updatedAt: '2024-01-15T10:30:00.000Z'
                      },
                      meta: {
                        timestamp: '2024-01-15T12:00:00.000Z'
                      }
                    }
                  }
                }
              },
              404: {
                description: 'Usuário não encontrado',
                content: {
                  'application/json': {
                    example: {
                      success: false,
                      message: 'Usuário não encontrado',
                      error: 'User not found'
                    }
                  }
                }
              }
            }
          }
        }
      )
      .post(
        '/',
        async ({ body, userService }) => {
          const user = await userService.createUser(body)
          return this.createResponse(user, 'Usuário criado com sucesso')
        },
        {
          body: createUserSchema,
          detail: {
            summary: 'Criar novo usuário',
            description: 'Cria um novo usuário no sistema com nome e email únicos',
            tags: ['Users'],
            responses: {
              201: {
                description: 'Usuário criado com sucesso',
                content: {
                  'application/json': {
                    example: {
                      success: true,
                      message: 'Usuário criado com sucesso',
                      data: {
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        name: 'João Silva',
                        email: 'joao.silva@email.com',
                        createdAt: '2024-01-15T10:30:00.000Z',
                        updatedAt: '2024-01-15T10:30:00.000Z'
                      },
                      meta: {
                        timestamp: '2024-01-15T12:00:00.000Z'
                      }
                    }
                  }
                }
              },
              400: {
                description: 'Dados inválidos ou email já existente',
                content: {
                  'application/json': {
                    example: {
                      success: false,
                      message: 'Email já está em uso',
                      error: 'Duplicate email'
                    }
                  }
                }
              }
            }
          }
        }
      )
      .put(
        '/:id',
        async ({ params, body, userService }) => {
          const user = await userService.updateUser(params.id, body)
          return this.createResponse(user, 'Usuário atualizado com sucesso')
        },
        {
          params: userIdSchema,
          body: updateUserSchema,
          detail: {
            summary: 'Atualizar usuário',
            description: 'Atualiza os dados de um usuário existente',
            tags: ['Users'],
            requestBody: {
              content: {
                'application/json': {
                  example: {
                    name: 'Guilherme Alves',
                    email: '97guilherme.alves@gmail.com'
                  }
                }
              }
            }
          }
        }
      )
      .delete(
        '/:id',
        async ({ params, userService }) => {
          await userService.deleteUser(params.id)
          return this.createResponse(null, 'Usuário deletado com sucesso')
        },
        {
          params: userIdSchema,
          detail: {
            summary: 'Deletar usuário',
            description: 'Remove um usuário do sistema pelo ID',
            tags: ['Users']
          }
        }
      )
  }
}