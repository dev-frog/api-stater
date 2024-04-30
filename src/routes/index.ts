import express from 'express'
import config from 'config'
import SendResponse from '../utils/sendResponse'

const router = express.Router()

const PROJECT_NAME: string = config.get('db.project_name')

router.get('/', (req, res) => SendResponse.success({ res, message: `${PROJECT_NAME} api root directory` }))

export default router
