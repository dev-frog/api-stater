import 'dotenv/config'
import config from 'config'
import mongoose from 'mongoose'
import logger from './logger'

async function dbConnection() {
  const PROJECT_NAME = config.get<string>('db.project_name')
  const USERNAME = config.get<string>('db.username')
  const PASSWORD = config.get<string>('db.password')
  try {
    const url = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.mcaechs.mongodb.net/${PROJECT_NAME}?retryWrites=true&w=majority`

    await mongoose.connect(url, {})
    logger.info('Connected to the database')
  } catch (e: unknown) {
    logger.error('An error occurred while connecting to the database', (e as Error).message)
  }
}

export default dbConnection
