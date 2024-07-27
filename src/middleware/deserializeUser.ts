import { NextFunction, Request, Response } from 'express'
import SendErrorResponse from '../utils/sendErrorResponse'
import { verifyJWT } from '../utils/jwt'

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.ACCESS_TOKEN

  if (!accessToken) {
    return next()
  }

  const decoded = verifyJWT(accessToken, 'auth.accessTokenPrivateKey')

  if (decoded) {
    res.locals.user = decoded
  }

  if (decoded === null) {
    SendErrorResponse.error({ res, message: 'Invalid access token' })
  }

  return next()
}

export default deserializeUser
