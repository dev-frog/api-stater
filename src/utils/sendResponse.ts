// sendResponse.ts
import { Response } from 'express'
import status from 'http-status'

interface SendResponseProps<T> {
  res: Response
  data?: T
  message?: string
}

export default class SendResponse {
  private static sendResponse<T>(res: Response, statusCode: number, { data, message }: SendResponseProps<T>) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    })
  }

  static success<T>(props: SendResponseProps<T>) {
    return this.sendResponse(props.res, status.OK, props)
  }

  static created<T>(props: SendResponseProps<T>) {
    return this.sendResponse(props.res, status.CREATED, props)
  }

  static updated<T>(props: SendResponseProps<T>) {
    return this.sendResponse(props.res, status.OK, props)
  }

  static deleted(props: SendResponseProps<undefined>) {
    return this.sendResponse(props.res, status.OK, props)
  }

  // error response
  static error(props: SendResponseProps<undefined>) {
    return this.sendResponse(props.res, status.BAD_REQUEST, props)
  }
}
