import express, { Express, Request, Response } from 'express'
import helmet from 'helmet'
import cors, { CorsOptions } from 'cors'
import 'dotenv/config'

import router from './routes'
import { errorHandler, notFoundHandler } from './middleware/error-handler'
import SendResponse from './utils/sendResponse'
import swaggerDocs from './utils/swagger'
import deserializeUser from './middleware/deserializeUser'
import cookieParser from 'cookie-parser'

const app: Express = express()

app.use(express.json())
app.use(helmet())

const corsOptions: CorsOptions = {
  origin: ['*', 'http://localhost:3000', 'https://localhost:3000', 'http://localhost:300']
}

app.use(cors(corsOptions))
app.use(cookieParser())

app.use(deserializeUser)

app.get('/', (req: Request, res: Response) => SendResponse.success({ res, message: 'dev-frog api stater kit' }))

app.use('/api/v1', router)

swaggerDocs(app)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
