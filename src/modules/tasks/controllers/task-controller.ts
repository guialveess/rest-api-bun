import { Elysia } from 'elysia'
import { TaskService } from '../useCases/task-service.js'
import { 
  createTaskSchema, 
  updateTaskSchema, 
  taskIdSchema, 
  listTasksQuerySchema 
} from '@/schemas/index.js'

export class TaskController {
  private taskService: TaskService

  constructor() {
    this.taskService = new TaskService()
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
    return new Elysia({ prefix: '/tasks' })
      .decorate('taskService', this.taskService)
      .get(
        '/',
        async ({ query, taskService }) => {
          const result = await taskService.getAllTasks(query)
          return {
            ...this.createResponse(result.data),
            pagination: result.pagination
          }
        },
        {
          query: listTasksQuerySchema,
          detail: {
            summary: 'Listar todas as tarefas',
            description: 'Retorna uma lista paginada de tarefas com filtros opcionais por status, usuário, data e termo de busca',
            tags: ['Tasks'],
            responses: {
              200: {
                description: 'Lista de tarefas retornada com sucesso',
                content: {
                  'application/json': {
                    example: {
                      success: true,
                      data: [
                        {
                          id: '550e8400-e29b-41d4-a716-446655440000',
                          title: 'Implementar autenticação JWT',
                          description: 'Adicionar sistema de autenticação usando tokens JWT para proteger as rotas da API',
                          status: 'PENDING',
                          userId: '550e8400-e29b-41d4-a716-446655440001',
                          createdAt: '2024-01-15T10:30:00.000Z',
                          updatedAt: '2024-01-15T10:30:00.000Z'
                        }
                      ],
                      pagination: {
                        page: 1,
                        limit: 10,
                        total: 1,
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
        '/statistics',
        async ({ taskService }) => {
          const statistics = await taskService.getTaskStatistics()
          return this.createResponse(statistics)
        },
        {
          detail: {
            summary: 'Obter estatísticas das tarefas',
            description: 'Retorna estatísticas gerais das tarefas (total, pendentes, concluídas, etc.)',
            tags: ['Tasks'],
            responses: {
              200: {
                description: 'Estatísticas retornadas com sucesso',
                content: {
                  'application/json': {
                    example: {
                      success: true,
                      data: {
                        total: 25,
                        pending: 15,
                        completed: 10,
                        completionRate: 40,
                        recentTasks: 5
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
        async ({ params, taskService }) => {
          const task = await taskService.getTaskById(params.id)
          return this.createResponse(task)
        },
        {
          params: taskIdSchema,
          detail: {
            summary: 'Buscar tarefa por ID',
            description: 'Retorna os detalhes de uma tarefa específica pelo seu ID',
            tags: ['Tasks'],
            responses: {
              200: {
                description: 'Tarefa encontrada com sucesso',
                content: {
                  'application/json': {
                    example: {
                      success: true,
                      data: {
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        title: 'Implementar autenticação JWT',
                        description: 'Adicionar sistema de autenticação usando tokens JWT para proteger as rotas da API',
                        status: 'PENDING',
                        userId: '550e8400-e29b-41d4-a716-446655440001',
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
                description: 'Tarefa não encontrada',
                content: {
                  'application/json': {
                    example: {
                      success: false,
                      message: 'Tarefa não encontrada',
                      error: 'Not found'
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
        async ({ body, taskService }) => {
          const task = await taskService.createTask(body)
          return this.createResponse(task, 'Tarefa criada com sucesso')
        },
        {
          body: createTaskSchema,
          detail: {
            summary: 'Criar nova tarefa',
            description: 'Cria uma nova tarefa associada a um usuário',
            tags: ['Tasks'],
            responses: {
              201: {
                description: 'Tarefa criada com sucesso',
                content: {
                  'application/json': {
                    example: {
                      success: true,
                      message: 'Tarefa criada com sucesso',
                      data: {
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        title: 'Implementar autenticação JWT',
                        description: 'Adicionar sistema de autenticação usando tokens JWT para proteger as rotas da API',
                        status: 'PENDING',
                        userId: '550e8400-e29b-41d4-a716-446655440001',
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
                description: 'Dados inválidos',
                content: {
                  'application/json': {
                    example: {
                      success: false,
                      message: 'Título da tarefa é obrigatório',
                      error: 'Validation error'
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
        async ({ params, body, taskService }) => {
          const task = await taskService.updateTask(params.id, body)
          return this.createResponse(task, 'Tarefa atualizada com sucesso')
        },
        {
          params: taskIdSchema,
          body: updateTaskSchema,
          detail: {
            summary: 'Atualizar tarefa por ID',
            description: 'Atualiza os dados de uma tarefa existente',
            tags: ['Tasks'],
            requestBody: {
              content: {
                'application/json': {
                  example: {
                    title: 'Comprar pão e leite',
                    description: 'Ir na padaria comprar pão fresco e no mercado comprar leite para o café da manhã',
                    status: 'COMPLETED'
                  }
                }
              }
            },
            responses: {
              200: {
                description: 'Tarefa atualizada com sucesso',
                content: {
                  'application/json': {
                    example: {
                      success: true,
                      message: 'Tarefa atualizada com sucesso',
                      data: {
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        title: 'Comprar pão e leite',
                        description: 'Ir na padaria comprar pão fresco e no mercado comprar leite para o café da manhã',
                        status: 'COMPLETED',
                        userId: '550e8400-e29b-41d4-a716-446655440001',
                        createdAt: '2024-01-15T10:30:00.000Z',
                        updatedAt: '2024-01-15T14:30:00.000Z'
                      },
                      meta: {
                        timestamp: '2024-01-15T14:30:00.000Z'
                      }
                    }
                  }
                }
              },
              404: {
                description: 'Tarefa não encontrada',
                content: {
                  'application/json': {
                    example: {
                      success: false,
                      message: 'Tarefa não encontrada',
                      error: 'Not found'
                    }
                  }
                }
              }
            }
          }
        }
      )
      .delete(
        '/:id',
        async ({ params, taskService }) => {
          await taskService.deleteTask(params.id)
          return this.createResponse(null, 'Tarefa deletada com sucesso')
        },
        {
          params: taskIdSchema,
          detail: {
            summary: 'Deletar tarefa por ID',
            description: 'Remove permanentemente uma tarefa do sistema',
            tags: ['Tasks'],
            responses: {
              200: {
                description: 'Tarefa deletada com sucesso',
                content: {
                  'application/json': {
                    example: {
                      success: true,
                      message: 'Tarefa deletada com sucesso',
                      data: null,
                      meta: {
                        timestamp: '2024-01-15T14:30:00.000Z'
                      }
                    }
                  }
                }
              },
              404: {
                description: 'Tarefa não encontrada',
                content: {
                  'application/json': {
                    example: {
                      success: false,
                      message: 'Tarefa não encontrada',
                      error: 'Not found'
                    }
                  }
                }
              }
            }
          }
        }
      )
      .get(
        '/user/:userId',
        async ({ params, taskService }) => {
          const tasks = await taskService.getTasksByUserId(params.id)
          return this.createResponse(tasks)
        },
        {
          params: taskIdSchema,
          detail: {
            summary: 'Buscar tarefas por ID do usuário',
            description: 'Retorna todas as tarefas associadas a um usuário específico',
            tags: ['Tasks'],
            responses: {
              200: {
                description: 'Lista de tarefas do usuário retornada com sucesso',
                content: {
                  'application/json': {
                    example: {
                      success: true,
                      data: [
                        {
                          id: '550e8400-e29b-41d4-a716-446655440000',
                          title: 'Implementar autenticação JWT',
                          description: 'Adicionar sistema de autenticação usando tokens JWT',
                          status: 'PENDING',
                          userId: '550e8400-e29b-41d4-a716-446655440001',
                          createdAt: '2024-01-15T10:30:00.000Z',
                          updatedAt: '2024-01-15T10:30:00.000Z'
                        },
                        {
                          id: '550e8400-e29b-41d4-a716-446655440002',
                          title: 'Revisar código do PR #123',
                          description: 'Fazer code review do pull request',
                          status: 'COMPLETED',
                          userId: '550e8400-e29b-41d4-a716-446655440001',
                          createdAt: '2024-01-14T09:00:00.000Z',
                          updatedAt: '2024-01-15T11:00:00.000Z'
                        }
                      ],
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
                      error: 'Not found'
                    }
                  }
                }
              }
            }
          }
        }
      )
  }
}