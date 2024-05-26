import { Request, Response } from 'express'
import { z } from 'zod'
import UserCreationError from '../utils/error'
import SendResponse from '../utils/sendResponse'
import { CreateUserInputType } from '../schemas/user.schema'

export async function createUser(
  req: Request<Record<string, never>, Record<string, never>, CreateUserInputType>,
  res: Response
) {
  const { email, password } = req.body
  try {
    SendResponse.success({
      res,
      data: {
        email,
        password
      },
      message: 'User created successfully'
    })
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

export async function getUser(req: Request, res: Response) {
  const { email } = req.body
  try {
    SendResponse.success({
      res,
      data: {
        email
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
