import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório').max(255, 'Título muito longo'),
  description: z.string().max(1000, 'Descrição muito longa').optional(),
  status: z.enum(['PENDING', 'DONE']).default('PENDING'),
  userId: z.string().uuid('Formato de ID de usuário inválido')
})

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório').max(255, 'Título muito longo').optional(),
  description: z.string().max(1000, 'Descrição muito longa').optional(),
  status: z.enum(['PENDING', 'DONE']).optional(),
  userId: z.string().uuid('Formato de ID de usuário inválido').optional()
}).refine(data => 
  data.title !== undefined || 
  data.description !== undefined || 
  data.status !== undefined || 
  data.userId !== undefined, {
  message: 'Pelo menos um campo deve ser fornecido'
})

export const taskIdSchema = z.object({
  id: z.string().uuid('Formato de ID de tarefa inválido')
})

export const listTasksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.enum(['PENDING', 'DONE']).optional(),
  userId: z.string().uuid('Formato de ID de usuário inválido').optional(),
  sortBy: z.enum(['title', 'status', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional()
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type TaskIdInput = z.infer<typeof taskIdSchema>
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>