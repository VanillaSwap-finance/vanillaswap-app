import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ApiError as AxiosApiError } from '@/utils/axios/types'
import { createErrorResponse } from '@/utils/axios/response'
import { CustomError } from '@/types/error'
import { logError } from '@/utils/error'

export type ApiHandler = (req: NextRequest) => Promise<Response>

export function createApiHandler(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
      logError(error, 'API Handler')

      // Zodエラー
      if (error instanceof z.ZodError) {
        return createErrorResponse('リクエストパラメータが不正です', 400)
      }

      if (error instanceof CustomError) {
        return createErrorResponse(error.message, error.statusCode || 500)
      }

      if ((error as AxiosApiError).status) {
        const apiError = error as AxiosApiError
        return createErrorResponse(apiError.message, apiError.status)
      }

      // 予期せぬエラー
      return createErrorResponse('予期せぬエラーが発生しました', 500)
    }
  }
}
