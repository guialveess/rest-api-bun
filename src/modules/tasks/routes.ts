import { TaskController } from './controllers/task-controller.js'

const taskController = new TaskController()

export const taskRoutes = taskController.getRoutes()