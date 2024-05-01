import express from 'express'
import config from 'config'
import SendResponse from '../utils/sendResponse'
import user from './user.router'

const router = express.Router()

const PROJECT_NAME: string = config.get('db.project_name')
/**
 * @openapi
 * '/api/v1/':
 *  post:
 *     tags:
 *     - User
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.get('/', (req, res) => SendResponse.success({ res, message: `${PROJECT_NAME} api root directory` }))

router.use('/user', user)

export default router
