import express from 'express'
import { deleteUser, getUser, updateUser } from '../controllers/user.controller'
import requireUser from '../middleware/requireUser'

const router = express.Router()

router.get('/', requireUser, getUser).put('/', requireUser, updateUser).delete('/', requireUser, deleteUser)

export default router
