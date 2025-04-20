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
  private retryCount: number = 3
  private retryDelay: number = 1000

  constructor(baseUrl: string = XRPLMETA_API_CONFIG.baseUrl) {
    this.baseUrl = baseUrl
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  protected async fetch<T>(
    endpoint: string,
    options?: RequestInit,
  ): ApiResponse<T> {
    let lastError: Error | null = null

    for (let i = 0; i < this.retryCount; i++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...options?.headers,
          },
          mode: 'cors',
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('API Error Response:', errorText)
          throw new Error(`API error: ${response.status} - ${errorText}`)
        }

        return response.json()
      } catch (error) {
        console.error('API Request Error:', error)
        lastError = error instanceof Error ? error : new Error(String(error))

        if (i < this.retryCount - 1) {
          await this.delay(this.retryDelay * Math.pow(2, i)) // Exponential backoff
          continue
        }
      }
    }

    throw lastError || new Error('Unknown error occurred')
  }
}
