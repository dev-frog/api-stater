import { NextFunction, Request, Response } from 'express'
import SendErrorResponse from '../utils/sendErrorResponse'
const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user

  if (!user) {
    return SendErrorResponse.unauthorized({
      res,
      message: 'Unauthorized'
    })
  }

  next()
}

export default requireUser
