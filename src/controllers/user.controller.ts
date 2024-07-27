import { Request, Response } from 'express'
import { z } from 'zod'
import SendResponse from '../utils/sendResponse'

export async function getUser(req: Request, res: Response) {
  const { email } = res.locals.user
  try {
    SendResponse.success({
      res,
      data: {
        email: email
      },
      message: 'User fetched successfully'
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

export async function updateUser(req: Request, res: Response) {
  const { email } = req.body
  try {
    SendResponse.updated({
      res,
      data: {
        email
      },
      message: 'User updated successfully'
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

export async function deleteUser(req: Request, res: Response) {
  try {
    SendResponse.deleted({
      res,
      message: 'User deleted successfully'
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
