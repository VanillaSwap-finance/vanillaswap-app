export const XRPLMETA_API_CONFIG = {
  baseUrl: 'https://s1.xrplmeta.org',
  endpoints: {
    tokens: '/tokens',
    token: '/token',
  },
} as const

export type ApiResponse<T> = Promise<T>

export class XRPLMetaApiClient {
  private baseUrl: string

  constructor(baseUrl: string = XRPLMETA_API_CONFIG.baseUrl) {
    this.baseUrl = baseUrl
  }

  protected async fetch<T>(
    endpoint: string,
    options?: RequestInit,
  ): ApiResponse<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return response.json()
  }
}
