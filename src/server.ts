import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { globalMiddleware } from '@/middleware/global-middleware.js'
import { errorHandler } from '@/middleware/error-handler.js'
import { userRoutes } from '@/modules/users/routes.js'
import { taskRoutes } from '@/modules/tasks/routes.js'
import { prisma } from '@/lib/database.js'
import { Server } from 'http'

const port = Number(process.env.PORT) || 3001
const nodeEnv = process.env.NODE_ENV || 'development'

const app = new Elysia()
  .use(globalMiddleware)
  .use(errorHandler)
  .use(swagger({
    documentation: {
      info: {
        title: 'REST API - Users & Tasks by guiialves',
        version: '1.0.0',
        description: 'API REST escalável construída com Elysia, TypeScript, Prisma e PostgreSQL. Permite gerenciar usuários e suas tarefas com operações completas de CRUD, paginação, filtragem e ordenação.',
        contact: {
          name: 'Guilherme Alves de Souza',
          email: '97guilherme.alves@gmail.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: `http://localhost:${port}`,
          description: 'Servidor de desenvolvimento'
        }
      ],
      tags: [
        { 
          name: 'Users', 
          description: 'Operações de gerenciamento de usuários - criar, listar, atualizar e excluir usuários' 
        },
        { 
          name: 'Tasks', 
          description: 'Operações de gerenciamento de tarefas - criar, listar, atualizar e excluir tarefas associadas aos usuários' 
        },
        {
          name: 'Health',
          description: 'Endpoints para verificar a saúde da API e conexão com o banco de dados'
        }
      ],
      components: {
        schemas: {
          Error: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              message: { type: 'string', example: 'Erro interno do servidor' },
              error: { type: 'string', example: 'Detalhes do erro...' }
            }
          },
          SuccessResponse: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              message: { type: 'string', example: 'Operação realizada com sucesso' },
              data: { type: 'object' }
            }
          }
        }
      }
    },
    path: '/docs',
    exclude: ['/docs', '/docs/json']
  }))
  .get('/', () => ({
    success: true,
    message: 'A API REST está funcionando!',
    version: '1.0.0',
    docs: '/docs',
    meta: {
      timestamp: new Date().toISOString(),
      environment: nodeEnv
    }
  }), {
    tags: ['Health'],
    detail: {
      summary: 'Status da API',
      description: 'Retorna informações básicas sobre o status da API',
      responses: {
        200: {
          description: 'API funcionando corretamente',
          content: {
            'application/json': {
              example: {
                success: true,
                message: 'A API REST está funcionando! 🚀',
                version: '1.0.0',
                docs: '/docs',
                meta: {
                  timestamp: '2024-01-15T10:30:00.000Z',
                  environment: 'development'
                }
              }
            }
          }
        }
      }
    }
  })
  .get('/health', async () => {
    try {
      await prisma.$queryRaw`SELECT 1`
      
      return {
        success: true,
        status: 'saudável',
        services: {
          database: 'conectado',
          server: 'rodando'
        },
        meta: {
          timestamp: new Date().toISOString(),
          uptime: process.uptime()
        }
      }
    } catch (error) {
      return {
        success: false,
        status: 'problemático',
        services: {
          database: 'desconectado',
          server: 'rodando'
        },
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        meta: {
          timestamp: new Date().toISOString()
        }
      }
    }
  }, {
    tags: ['Health'],
    detail: {
      summary: 'Verificação de Saúde',
      description: 'Verifica o status da API e conexão com o banco de dados',
      responses: {
        200: {
          description: 'Status da aplicação (saudável ou não)',
          content: {
            'application/json': {
              examples: {
                healthy: {
                  summary: 'Sistema saudável',
                  value: {
                    success: true,
                    status: 'saudável',
                    services: {
                      database: 'conectado',
                      server: 'rodando'
                    },
                    meta: {
                      timestamp: '2024-01-15T10:30:00.000Z',
                      uptime: 3600
                    }
                  }
                },
                unhealthy: {
                  summary: 'Problema com o banco',
                  value: {
                    success: false,
                    status: 'problemático',
                    services: {
                      database: 'desconectado',
                      server: 'rodando'
                    },
                    error: 'Conexão recusada',
                    meta: {
                      timestamp: '2024-01-15T10:30:00.000Z'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  .use(userRoutes)
  .use(taskRoutes)
  .listen(port)

console.log(`Servidor rodando na porta ${port}`)
console.log(`Documentação da API: http://localhost:${port}/docs`)
console.log(`Verificação de Saúde: http://localhost:${port}/health`)
