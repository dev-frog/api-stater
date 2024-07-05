import status from 'http-status'
import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodError } from 'zod'

const validateResource = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    })
    next()
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      const errorMessages = e.issues.map((issue) => issue.message)
      return res.status(status.BAD_REQUEST).send({ message: errorMessages[0], success: false })
    }
    return res.status(status.BAD_REQUEST).send({ error: (e as Error).message, success: false })
  }

  return null
}

export default validateResource
