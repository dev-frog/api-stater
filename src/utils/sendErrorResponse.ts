// sendResponse.ts
import { Response } from 'express'
import status from 'http-status'

interface ErrorResponseProps<T> {
  res: Response
  data?: T
  message?: string
}

export default class SendErrorResponse {
  private static sendErrorResponse<T>(res: Response, statusCode: number, { data, message }: ErrorResponseProps<T>) {
    return res.status(statusCode).json({
      success: false,
      message,
      data
    })
  }

  static error<T>(props: ErrorResponseProps<T>) {
    return this.sendErrorResponse(props.res, status.BAD_REQUEST, props)
  }

  static conflict<T>(props: ErrorResponseProps<T>) {
    return this.sendErrorResponse(props.res, status.CONFLICT, props)
  }
}
