export interface ApiError {
  status: number
  message: string
  code?: string
  name?: string
  isAxiosError?: boolean
  toJSON?: () => object
}

export interface ApiResponse<T> {
  data: T
  status: number
}

export interface ApiConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  enableLogging?: boolean
}
