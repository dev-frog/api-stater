import { Express, Request, Response } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import logger from './logger'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'REST API Docs',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['src/routes/*.ts', 'src/schemas/*.ts']
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app: Express) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  app.get('/docs.json', (req: Request, res: Response) => {
    res.json(swaggerSpec)
  })

  logger.info('Swagger Docs initialized')
}

export default swaggerDocs
