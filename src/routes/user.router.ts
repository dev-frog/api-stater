import express from 'express'
import { createUserSchema } from '../schemas/user.schema'
import validateResource from '../middleware/validateResource'
import { createUser, deleteUser, getUser, updateUser } from '../controllers/user.controller'

const router = express.Router()

router
  .post('/', validateResource(createUserSchema), createUser)
  .get('/', getUser)
  .put('/', updateUser)
  .delete('/', deleteUser)

export default router
