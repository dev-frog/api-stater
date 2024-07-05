import config from 'config'
import { DocumentType } from '@typegoose/typegoose'
import { omit } from 'lodash'
import { privateFields, SessionModel, User, UserModel } from '../model'
import { singJWT } from '../utils/jwt'

export function registerUser(data: Partial<User>) {
  return UserModel.create(data)
}

export async function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ user: userId })
}

// remove the session from the database
export async function deleteSession({ userId }: { userId: string }) {
  return SessionModel.deleteOne({ user: userId })
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id)
}

export function verifyUser(email: string): Promise<User | null> {
  return UserModel.findOneAndUpdate(
    { email },
    { verified: true, verificationCode: null, verificationCodeExpires: null },
    { new: true }
  ).exec()
}

export function setUserPasswordResetCode(userId: string, code: string, expires: Date) {
  return UserModel.findByIdAndUpdate(userId, { passwordResetCode: code, passwordResetCodeExpires: expires }).exec()
}

export async function resetPassword(userId: string, password: string) {
  return UserModel.findByIdAndUpdate(userId, {
    password,
    passwordResetCode: null,
    passwordResetCodeExpires: null
  }).exec()
}

export function singAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), privateFields)
  const accessTokenExpiresTTL = config.get('auth.accessTokenTtl') as string

  const accessToken = singJWT(payload, 'auth.accessTokenPrivateKey', {
    expiresIn: accessTokenExpiresTTL
  })

  return accessToken
}

export async function singRefreshToken({ userId }: { userId: string }) {
  const refreshTokenExpiresTTL = config.get('auth.refreshTokenTtl') as string
  await deleteSession({ userId })
  const session = await createSession({ userId })

  const refreshToken = singJWT(
    {
      session: session.id
    },
    'auth.refreshTokenPrivateKey',
    {
      expiresIn: refreshTokenExpiresTTL
    }
  )

  return refreshToken
}

export function setUserVerificationCode(userId: string, code: string) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      verificationCode: code,
      verificationCodeExpires: new Date(Date.now() + 3 * 60000)
    },
    { new: true }
  ).lean()
}
