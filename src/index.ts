import 'dotenv/config'

import config from 'config'
import app from './app'
import logger from './utils/logger'

const port: number = config.get('server.port')

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`)
})
