import { XRPLMetaApiClient, XRPLMETA_API_CONFIG } from './api'
import type {
  ListTokensParams,
  ListTokensResponse,
  GetTokenParams,
  GetTokenResponse,
} from '@/libs/xrplmeta/types'

export class TokensApi extends XRPLMetaApiClient {
  // List Tokens
  async listTokens(params: ListTokensParams): Promise<ListTokensResponse> {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          searchParams.set(key, value.join(','))
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    let url = `${XRPLMETA_API_CONFIG.endpoints.tokens}?`
    
    const paramsString = searchParams.toString().replace(/%2C/g, ',')
    
    return this.fetch<ListTokensResponse>(
      `${url}${paramsString}`,
    )
  }

  // Get Token
  async getToken(params: GetTokenParams): Promise<GetTokenResponse> {
    const { identifier, ...queryParams } = params
    const searchParams = new URLSearchParams()

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })

    const query = searchParams.toString()
    const endpoint = `${XRPLMETA_API_CONFIG.endpoints.token}/${identifier}${
      query ? `?${query}` : ''
    }`

    return this.fetch<GetTokenResponse>(endpoint)
  }
}

export const tokensApi = new TokensApi()
