import 'dotenv/config'

import config from 'config'
import app from './app'
import logger from './utils/logger'
import dbConnection from './utils/db-connection'

const port: number = config.get('server.port')

app.listen(port, async () => {
  dbConnection()
  logger.info(`Server is running on http://localhost:${port}`)
})
