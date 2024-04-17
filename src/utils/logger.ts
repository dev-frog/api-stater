import { createLogger, transports, format } from 'winston'

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json(), format.prettyPrint()),
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
})

export default logger
