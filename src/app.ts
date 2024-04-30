import express, { Express, Request, Response } from 'express'
import status from 'http-status'
import helmet from 'helmet'
import cors, { CorsOptions } from 'cors'
import 'dotenv/config'

import router from './routes'

const app: Express = express()

app.use(express.json())
app.use(helmet())

const corsOptions: CorsOptions = {
  origin: ['*', 'http://localhost:3000', 'https://localhost:3000', 'http://localhost:300']
}

app.use(cors(corsOptions))

app.get('/', (req: Request, res: Response) => {
  res.status(status.OK).json({ message: 'Hello World', success: true })
})

app.use('/api/v1', router)

export default app
