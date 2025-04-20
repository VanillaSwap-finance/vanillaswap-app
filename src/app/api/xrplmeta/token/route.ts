import { NextRequest } from 'next/server'

import { createApiHandler } from '@/utils/axios/handler'
import {
  createSuccessResponse,
  createErrorResponse,
} from '@/utils/axios/response'
import { ApiClient } from '@/utils/axios/client'
import { decodeHexToAscii } from '@/utils/string'
import { TokenQuerySchema, TokenResponseSchema } from './schema'

const client = new ApiClient({
  baseURL: process.env.XRPLMETA_API_URL ?? 'https://s1.xrplmeta.org',
  enableLogging: process.env.NODE_ENV === 'development',
})

const handler = async (req: NextRequest) => {
  try {
    const params = TokenQuerySchema.parse(
      Object.fromEntries(new URL(req.url).searchParams.entries()),
    )

    const { data } = await client.get('/tokens', { params })

    const parsedData = TokenResponseSchema.parse(data)

    const filteredData = parsedData.tokens.filter(
      (token) => token.meta.token.name !== undefined,
    )

    const decodedData = filteredData.map((token) => {
      return {
        ...token,
        currency: decodeHexToAscii(token.currency),
      }
    })

    return createSuccessResponse(decodedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('[Token API Error]:', error)
    return createErrorResponse('Internal server error', 500)
  }
}

export const GET = createApiHandler(handler)
