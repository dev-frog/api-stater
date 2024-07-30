import { NextFunction, Request, Response } from 'express'
import SendErrorResponse from '../utils/sendErrorResponse'
import { verifyJWT } from '../utils/jwt'
import SendResponse from '../utils/sendResponse'
import { findSessionById, findUserById, singAccessToken, singRefreshToken } from '../services'

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.ACCESS_TOKEN

  if (!accessToken) {
    return next()
  }

  const decoded = verifyJWT(accessToken, 'auth.accessTokenPrivateKey')

  if (decoded) {
    res.locals.user = decoded.payload
  }

  if (decoded.payload === null) {
    if (decoded.expired) {
      // return SendErrorResponse.unauthorized({ res, message: 'Access token expired' })
      const refreshToken = req.cookies.REFRESH_TOKEN

      if (!refreshToken) {
        return SendErrorResponse.unauthorized({ res, message: 'Refresh token not found' })
      }

      const decodedRefresh = verifyJWT(refreshToken, 'auth.refreshTokenPrivateKey')

      if (decodedRefresh.payload === null) {
        if (decodedRefresh.expired) {
          return SendErrorResponse.unauthorized({ res, message: 'Refresh token expired' })
        }

        return SendErrorResponse.unauthorized({ res, message: 'Invalid refresh token' })
      }

      if (decodedRefresh.payload) {
        const session = await findSessionById((decodedRefresh.payload as { session: string }).session)

        if (!session) {
          return SendErrorResponse.unauthorized({ res, message: 'Invalid refresh token' })
        }

        const user = await findUserById(String(session.user))

        if (!user) {
          return SendErrorResponse.unauthorized({ res, message: 'Invalid refresh token' })
        }

        const accessToken = singAccessToken(user)
        const refreshToken = await singRefreshToken({ userId: user.id })

        res.cookie('ACCESS_TOKEN', accessToken, { httpOnly: true, secure: true })
        res.cookie('REFRESH_TOKEN', refreshToken, { httpOnly: true, secure: true })

        return next()
      }

      return SendErrorResponse.unauthorized({ res, message: 'Invalid refresh token' })
    }
  }

  return next()
}

export default deserializeUser
