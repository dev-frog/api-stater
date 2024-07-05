import config from 'config'
import jwt from 'jsonwebtoken'
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
): T | null {
  const publicKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii')
  try {
    const decoded = jwt.verify(token, publicKey)
    return decoded as T
  } catch (error) {
    return null
  }
}
