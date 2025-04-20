import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ApiError } from '@/utils/axios/types'
import { createErrorResponse } from '@/utils/axios/response'

export type ApiHandler = (req: NextRequest) => Promise<Response>

export function createApiHandler(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
      console.error('API Error:', error)

      // Zodエラー
      if (error instanceof z.ZodError) {
        return createErrorResponse('Invalid request parameters', 400)
      }

      // 予期せぬエラー
      if ((error as ApiError).status) {
        const apiError = error as ApiError
        return createErrorResponse(apiError.message, apiError.status)
      }

      // 予期せぬエラー
      return createErrorResponse('An unexpected error occurred', 500)
    }
  }
}
