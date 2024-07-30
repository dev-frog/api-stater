import config from 'config'
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import logger from './logger'

export function singJWT(
  object: Record<string, unknown>,
  keyName: 'auth.accessTokenPrivateKey' | 'auth.refreshTokenPrivateKey',
  options?: jwt.SignOptions | undefined
): string | null {
  try {
    const singingKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii')

    const token = jwt.sign(object, singingKey, {
      ...(options && options),
      algorithm: 'RS256'
    })

    return token
  } catch (error) {
    logger.error(error)
    return null
  }
}

export function verifyJWT<T>(
  token: string,
  keyName: 'auth.accessTokenPrivateKey' | 'auth.refreshTokenPrivateKey'
): { payload: T | null; expired: boolean } {
  const publicKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii')
  try {
    const decoded = jwt.verify(token, publicKey)
    return { payload: decoded as T, expired: false }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return { payload: null, expired: true }
    }
    return { payload: null, expired: false }
  }
}
