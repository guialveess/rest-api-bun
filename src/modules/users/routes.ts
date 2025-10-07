import { UserController } from './controllers/user-controller.js'

const userController = new UserController()

export const userRoutes = userController.getRoutes()