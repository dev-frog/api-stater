import express from 'express'
import { deleteUser, getUser, updateUser } from '../controllers/user.controller'

const router = express.Router()

router.get('/', getUser).put('/', updateUser).delete('/', deleteUser)

export default router
