import { NextFunction, Request, Response } from 'express'

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.replace(/^Bearer\s/, '')

  if (!accessToken) {
    return next()
  }

  return next()
}

export default deserializeUser
