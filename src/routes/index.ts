import express from 'express'
import config from 'config'
import SendResponse from '../utils/sendResponse'
import user from './user.router'
import auth from './auth.router'

const router = express.Router()

const PROJECT_NAME: string = config.get('db.project_name')

router.get('/', (req, res) => SendResponse.success({ res, message: `${PROJECT_NAME} api root directory` }))

router.use('/user', user)
router.use('/auth', auth)

export default router
