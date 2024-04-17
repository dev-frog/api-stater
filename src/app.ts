import express, { Express, Request, Response } from 'express'
import helmet from 'helmet'
import cors, { CorsOptions } from 'cors'
import 'dotenv/config'

const app: Express = express()

app.use(express.json())
app.use(helmet())

const corsOptions: CorsOptions = {
  origin: 'http://localhost:8080'
}

app.use(cors(corsOptions))

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

export default app
