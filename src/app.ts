import express, { Express, Request, Response } from 'express'
import helmet from 'helmet'
import cors, { CorsOptions } from 'cors'
import 'dotenv/config'
import rateLimit from 'express-rate-limit'

import router from './routes'
import { errorHandler, notFoundHandler } from './middleware/error-handler'
import SendResponse from './utils/sendResponse'
import swaggerDocs from './utils/swagger'
import deserializeUser from './middleware/deserializeUser'
import cookieParser from 'cookie-parser'
import ignoreFavicon from './middleware/ignoreFunction'

const app: Express = express()

app.use(express.json())
app.use(helmet())

const corsOptions: CorsOptions = {
  origin: ['*', 'http://localhost:3000', 'https://localhost:3000', 'http://localhost:300']
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
})

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(limiter)

app.use(deserializeUser)
app.use(ignoreFavicon)

app.get('/', (req: Request, res: Response) => SendResponse.success({ res, message: 'dev-frog api stater kit' }))

app.use('/api/v1', router)

swaggerDocs(app)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
