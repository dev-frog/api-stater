import config from 'config'
import jwt from 'jsonwebtoken'
import logger from './logger'

export function singJWT(
  object: Record<string, unknown>,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
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
    logger.error(`Error signing JWT: ${error}`)
    return null
  }
}

export function verifyJWT<T>(token: string, keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'): T | null {
  const publicKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii')
  try {
    const decoded = jwt.verify(token, publicKey)
    return decoded as T
  } catch (error) {
    logger.error(`Error verifying JWT: ${error}`)
    return null
  }
}
