import { Request, Response } from 'express'
import { get } from 'lodash'
import { v4 as uuid } from 'uuid'
import SendResponse from '../utils/sendResponse'
import UserCreationError from '../utils/error'
import SendErrorResponse from '../utils/sendErrorResponse'
import { CreateUserInputType, ForgotPasswordInputType, LoginInputType, VerificationCodeInputType } from '../schemas'
import { findUserByEmail, findUserById } from '../services/user.service'
import {
  findSessionById,
  registerUser,
  setUserPasswordResetCode,
  setUserVerificationCode,
  singAccessToken,
  singRefreshToken,
  verifyUser
} from '../services/auth.service'
import logger from '../utils/logger'
import { verifyJWT } from '../utils/jwt'
import { z } from 'zod'

import { privateFields } from '../model'
import { sendVerificationEmail } from '../utils/sendEmail'
import { stripPrivateFields } from '../utils/privateDataFilter'

// TODO: DONE.
export async function userRegisterController(
  req: Request<Record<string, never>, Record<string, never>, CreateUserInputType>,
  res: Response
) {
  const data = req.body

  try {
    const user = await findUserByEmail(data.email)

    if (user) {
      SendErrorResponse.error({ res, message: 'user already exists' })
      return
    }

    const newUser = await registerUser(data)
    const response = stripPrivateFields(newUser, [...privateFields])

    sendVerificationEmail(newUser.name as string, newUser.email as string, newUser.verificationCode as string)

    SendResponse.success({ res, data: response, message: 'User Created successfully' })
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      SendResponse.error({
        res,
        message: e.errors[0].message
      })
    }
    if (e instanceof UserCreationError) {
      SendResponse.error({
        res,
        message: e.message
      })
    }
    SendResponse.error({
      res,
      message: 'Something went wrong'
    })
  }
}

export async function handleForgotPassword(req: Request, res: Response) {
  const data = req.body
  try {
    // check if user exists in the database using email
    const user = await findUserByEmail(data.email)
    // if user exists, return error
    if (user) {
      SendErrorResponse.error({ res, message: 'user already exists' })
      return
    }
    const newUser = await registerUser(data)
    const response = stripPrivateFields(newUser, [...privateFields])

    // sendVerificationEmail(newUser.name as string, newUser.email as string, newUser.verificationCode as string)

    SendResponse.success({ res, data: response, message: 'user created' })
  } catch (error: unknown) {
    SendErrorResponse.error({ res, message: (error as Error).message })
  }
}

export async function userLoginController(
  req: Request<Record<string, never>, Record<string, never>, LoginInputType>,
  res: Response
) {
  const { email, password } = req.body
  try {
    const user = await findUserByEmail(email)

    if (!user) {
      SendErrorResponse.error({ res, message: 'Incorrect email or password' })
      return
    }

    if (!user.verified) {
      SendErrorResponse.error({ res, message: 'Please verify your email to login' })
      return
    }

    if (user.isBlocked) {
      SendErrorResponse.error({ res, message: 'Your account is blocked' })
      return
    }

    const isMatch = await user.validatePassword(password)

    if (!isMatch) {
      SendErrorResponse.error({ res, message: 'Incorrect email or password' })
      return
    }

    // sing a access token
    const accessToken = singAccessToken(user)
    const refreshToken = await singRefreshToken({ userId: user.id })

    // save as cookie
    res.cookie('ACCESS_TOKEN', accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 3600000 })
    res.cookie('REFRESH_TOKEN', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 3600000 })

    SendResponse.success({ res, message: 'User login successfully' })
  } catch (error: unknown) {
    SendErrorResponse.error({ res, message: (error as Error).message })
  }
}

// TODO: DONE.
export async function verifyEmailController(
  req: Request<Record<string, never>, Record<string, never>, VerificationCodeInputType>,
  res: Response
) {
  const { email, token: verifyCode } = req.body
  try {
    const user = await findUserByEmail(email)
    if (!user) {
      SendErrorResponse.error({ res, message: 'Incorrect email or link expired' })
      return
    }

    if (user.verificationCode !== verifyCode) {
      SendErrorResponse.error({ res, message: 'Incorrect verification code or email' })
      return
    }

    if (user.verified) {
      SendErrorResponse.error({ res, message: 'Email already verified' })
      return
    }

    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      SendErrorResponse.error({ res, message: 'Verification code expired' })
      return
    }

    await verifyUser(email)

    SendResponse.success({ res, message: 'email successfully verified' })
  } catch (error: unknown) {
    SendErrorResponse.error({ res, message: (error as Error).message })
  }
}

export async function resendVerificationCodeController(
  req: Request<Record<string, never>, Record<string, never>, Record<string, never>>,
  res: Response
) {
  const email = get(req, 'body.email')
  const message = 'If a user with this email exists, we have sent a verification code to your email'

  if (typeof email !== 'string') {
    SendErrorResponse.error({ res, message })
    return
  }

  try {
    const user = await findUserByEmail(email)

    if (!user) {
      logger.error(`User with email ${email} not found`)
      SendResponse.success({ res, message })
      return
    }

    if (user.verified) {
      SendErrorResponse.error({ res, message: 'Email already verified' })
    }

    if (user.verificationCodeExpires && user.verificationCodeExpires > new Date()) {
      SendErrorResponse.error({ res, message: 'Verification code not expired' })
    }
    const verificationCode = uuid()
    await setUserVerificationCode(user._id.toString(), verificationCode)

    // sendVerificationEmail(user.name as string, user.email as string, user.verificationCode as string)

    SendResponse.success({ res, message, data: { email } })
  } catch (error: unknown) {
    SendErrorResponse.error({ res, message: (error as Error).message })
  }
}

export async function forgetPasswordController(
  req: Request<Record<string, never>, Record<string, never>, ForgotPasswordInputType>,
  res: Response
) {
  const email = get(req, 'body.email')
  const message = 'If a user with this email exists, we have sent a reset password link to your email'

  if (typeof email !== 'string') {
    SendErrorResponse.error({ res, message })
    return
  }

  try {
    const user = await findUserByEmail(email)

    if (!user) {
      logger.error(`User with email ${email} not found`)
      SendResponse.success({ res, message })
      return
    }

    if (!user.verified) {
      SendErrorResponse.error({ res, message: 'Please verify your email to reset password' })
      return
    }
    // password code expires in 5 minutes
    const expires = new Date(Date.now() + 5 * 60000)
    const code = uuid()

    await setUserPasswordResetCode(user.id, code, expires)

    // send email with password reset link
    // await sendPasswordResetEmail(user.name as string, user.email as string, code)
    SendResponse.success({ res, message })
  } catch (error: unknown) {
    SendErrorResponse.error({ res, message: (error as Error).message })
  }
}

export async function refreshTokenController(
  req: Request<Record<string, never>, Record<string, never>, Record<string, never>>,
  res: Response
) {
  const oldRefreshToken = get(req, 'headers.x-refresh')

  if (typeof oldRefreshToken !== 'string') {
    SendErrorResponse.error({ res, message: 'Invalid refresh token' })
    return
  }
  try {
    // verify refresh token
    const decoded = verifyJWT<{ session: string }>(oldRefreshToken, 'auth.refreshTokenPrivateKey')

    if (!decoded) {
      SendErrorResponse.error({ res, message: 'Invalid refresh token' })
      return
    }
    // get session id from refresh token
    const session = await findSessionById(decoded.session)
    // get session
    if (!session) {
      SendErrorResponse.error({ res, message: 'Invalid refresh token' })
      return
    }
    // get user from session
    const user = await findUserById(String(session.user))

    if (!user) {
      SendErrorResponse.error({ res, message: 'Invalid refresh token' })
      return
    }

    // sing a access token
    const accessToken = singAccessToken(user)
    const refreshToken = await singRefreshToken({ userId: user.id })

    // save as cookie
    res.cookie('ACCESS_TOKEN', accessToken, { httpOnly: true, secure: true })
    res.cookie('REFRESH_TOKEN', refreshToken, { httpOnly: true, secure: true })

    SendResponse.success({ res, message: 'Token refreshed successfully' })
  } catch (error: unknown) {
    SendErrorResponse.error({ res, message: (error as Error).message })
  }
}

export async function logoutController(req: Request, res: Response) {
  res.clearCookie('ACCESS_TOKEN')
  res.clearCookie('REFRESH_TOKEN')
  SendResponse.success({ res, message: 'Logout successfully' })
}
