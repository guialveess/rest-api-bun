import { z } from 'zod'
import { UserRepository } from '../repositories/user-repository.js'
import { CreateUserInput, UpdateUserInput, ListUsersQuery, UserIdInput } from '@/schemas/index.js'
import { User } from '@prisma/client'

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('Email já existe')
    }

    return this.userRepository.create(data)
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }
    return user
  }

  async getAllUsers(query: ListUsersQuery) {
    return this.userRepository.findAll(query)
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findById(id)
    if (!existingUser) {
      throw new Error('Usuário não encontrado')
    }

    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(data.email)
      if (emailExists) {
        throw new Error('Email já existe')
      }
    }

    return this.userRepository.update(id, data)
  }

  async deleteUser(id: string): Promise<User> {
    const existingUser = await this.userRepository.findById(id)
    if (!existingUser) {
      throw new Error('Usuário não encontrado')
    }

    return this.userRepository.delete(id)
  }

  async validateUserExists(id: string): Promise<void> {
    const exists = await this.userRepository.exists(id)
    if (!exists) {
      throw new Error('Usuário não encontrado')
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email)
  }
}