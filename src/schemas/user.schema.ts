import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório').max(255, 'Nome muito longo'),
  email: z.string().email('Formato de e-mail inválido').max(255, 'E-mail muito longo')
})

export const updateUserSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório').max(255, 'Nome muito longo').optional(),
  email: z.string().email('Formato de e-mail inválido').max(255, 'E-mail muito longo').optional()
}).refine(data => data.name !== undefined || data.email !== undefined, {
  message: 'Pelo menos um campo deve ser fornecido'
})
export const userIdSchema = z.object({
  id: z.string().uuid('Formato de ID de usuário inválido')
})

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'email', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UserIdInput = z.infer<typeof userIdSchema>
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>