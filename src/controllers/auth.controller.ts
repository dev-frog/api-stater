import { Request, Response } from 'express'
import { z } from 'zod'
import SendResponse from '../utils/sendResponse'

export async function handleForgotPassword(req: Request, res: Response) {
  const { email } = req.body
  try {
    SendResponse.success({
      res,
      data: {
        email
      },
      message: 'Password reset link sent successfully'
    })
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      SendResponse.error({
        res,
        message: e.errors[0].message
      })
    }
    SendResponse.error({
      res,
      message: 'Something went wrong'
    })
  }
}

export async function handleResetPassword(req: Request, res: Response) {
  const { email, password } = req.body
  try {
    SendResponse.success({
      res,
      data: {
        email,
        password
      },
      message: 'Password reset successfully'
    })
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      SendResponse.error({
        res,
        message: e.errors[0].message
      })
    }
    SendResponse.error({
      res,
      message: 'Something went wrong'
    })
  }
}

export async function verifyEmail(req: Request, res: Response) {
  const { email } = req.body
  try {
    SendResponse.success({
      res,
      data: {
        email
      },
      message: 'User verified successfully'
    })
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      SendResponse.error({
        res,
        message: e.errors[0].message
      })
    }
    SendResponse.error({
      res,
      message: 'Something went wrong'
    })
  }
}

export async function resendVerificationEmail(req: Request, res: Response) {
  const { email } = req.body
  try {
    SendResponse.success({
      res,
      data: {
        email
      },
      message: 'Verification email sent successfully'
    })
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      SendResponse.error({
        res,
        message: e.errors[0].message
      })
    }
    SendResponse.error({
      res,
      message: 'Something went wrong'
    })
  }
}
