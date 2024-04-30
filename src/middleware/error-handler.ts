import { NextFunction, Request, Response } from 'express'
import status from 'http-status'

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(status.NOT_FOUND).json({ message: error.message, success: false })
  next(error)
}

const errorHandler = (err: Error, req: Request, res: Response) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  res.json({
    message: err.message,
    success: false,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  })
}

export { notFoundHandler, errorHandler }
