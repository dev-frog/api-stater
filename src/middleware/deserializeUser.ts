import { NextFunction, Request, Response } from 'express'
import status from 'http-status'
import { verifyJWT } from '../utils/jwt'

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization || ''
    const accessToken = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (!accessToken) {
      return next()
    }

    const decoded = verifyJWT(accessToken, 'accessTokenPublicKey')

    if (decoded) {
      res.locals.user = decoded
      return next()
    }
    return res.status(status.UNAUTHORIZED).json({
      message: 'Unauthorized',
      success: false
    })
  } catch (error) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      success: false
    })
  }
}

export default deserializeUser
