import express from 'express'
import SendResponse from '../utils/sendResponse'

const router = express.Router()

router.get('/', (req, res) => SendResponse.success({ res, message: 'user api root directory' }))

export default router
