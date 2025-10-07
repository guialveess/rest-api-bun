import { TaskRepository, TaskWithUser } from '../repositories/task-repository.js'
import { UserRepository } from '@/modules/users/repositories/user-repository.js'
import { CreateTaskInput, UpdateTaskInput, ListTasksQuery } from '@/schemas/index.js'

export class TaskService {
  private taskRepository: TaskRepository
  private userRepository: UserRepository

  constructor() {
    this.taskRepository = new TaskRepository()
    this.userRepository = new UserRepository()
  }

  async createTask(data: CreateTaskInput): Promise<TaskWithUser> {
    await this.validateUserExists(data.userId)

    return this.taskRepository.create(data)
  }

  async getTaskById(id: string): Promise<TaskWithUser> {
    const task = await this.taskRepository.findById(id)
    if (!task) {
      throw new Error('Tarefa não encontrada')
    }
    return task
  }

  async getAllTasks(query: ListTasksQuery) {
    if (query.userId) {
      await this.validateUserExists(query.userId)
    }

    return this.taskRepository.findAll(query)
  }

  async updateTask(id: string, data: UpdateTaskInput): Promise<TaskWithUser> {
    const existingTask = await this.taskRepository.findById(id)
    if (!existingTask) {
      throw new Error('Tarefa não encontrada')
    }

    if (data.userId && data.userId !== existingTask.userId) {
      await this.validateUserExists(data.userId)
    }

    return this.taskRepository.update(id, data)
  }

  async deleteTask(id: string): Promise<TaskWithUser> {
    const existingTask = await this.taskRepository.findById(id)
    if (!existingTask) {
      throw new Error('Tarefa não encontrada')
    }

    return this.taskRepository.delete(id)
  }

  async getTasksByUserId(userId: string): Promise<TaskWithUser[]> {
    await this.validateUserExists(userId)

    return this.taskRepository.findByUserId(userId)
  }

  async getTaskStatistics() {
    const [pendingCount, doneCount, totalTasks] = await Promise.all([
      this.taskRepository.countByStatus('PENDING'),
      this.taskRepository.countByStatus('DONE'),
      this.taskRepository.findAll({ page: 1, limit: 1, sortBy: 'createdAt', sortOrder: 'desc' })
    ])

    return {
      pending: pendingCount,
      done: doneCount,
      total: totalTasks.pagination.total,
      completionRate: totalTasks.pagination.total > 0 
        ? Math.round((doneCount / totalTasks.pagination.total) * 100) 
        : 0
    }
  }

  private async validateUserExists(userId: string): Promise<void> {
    const exists = await this.userRepository.exists(userId)
    if (!exists) {
      throw new Error('Usuário não encontrado')
    }
  }
}