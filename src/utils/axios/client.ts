import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import type { ApiConfig, ApiResponse } from '@/utils/axios/types'
import { ApiLogger } from '@/utils/axios/logger'
import { handleAxiosError, notifyError } from '@/utils/error'

export class ApiClient {
  private client: AxiosInstance
  private logger: ApiLogger

  constructor(config: ApiConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    })

    this.logger = new ApiLogger('ApiClient', {
      enabled: config.enableLogging ?? true,
      isDevelopment: process.env.NODE_ENV === 'development',
      maskSensitiveData: true,
    })

    this.setupInterceptors()
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    retryCount: number = 3,
    delay: number = 1000,
  ): Promise<T> {
    try {
      const startTime = Date.now()
      const result = await operation()
      const duration = Date.now() - startTime

      this.logger.debug('API call successful', { duration })
      return result
    } catch (error) {
      const axiosError = error as AxiosError
      if (retryCount === 0 || !this.isRetryableError(axiosError)) {
        this.logger.error('API call failed permanently', {
          error: axiosError,
          path: axiosError.config?.url,
          method: axiosError.config?.method,
        })

        const apiError = handleAxiosError(axiosError, 'API呼び出し')
        throw apiError
      }

      this.logger.warn('API call failed, retrying', {
        error: axiosError,
        retryCount,
        delay,
        path: axiosError.config?.url,
        method: axiosError.config?.method,
      })

      await new Promise((resolve) => setTimeout(resolve, delay))
      return this.executeWithRetry(operation, retryCount - 1, delay * 2)
    }
  }

  private isRetryableError(error: AxiosError): boolean {
    // ネットワークエラーの場合
    if (!error.response && error.message === 'Network Error') {
      return true
    }

    const status = error.response?.status
    // リトライ対象のステータスコード
    const retryableStatuses = [408, 429, 500, 502, 503, 504]
    return status ? retryableStatuses.includes(status) : false
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // リクエストIDと開始時間を追加
        const requestConfig = config as any
        requestConfig.requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        requestConfig.startTime = Date.now()

        this.logger.logRequest(config)
        return config
      },
      (error) => {
        this.logger.logError(error, 'Request interceptor error')
        return Promise.reject(error)
      },
    )

    this.client.interceptors.response.use(
      (response) => {
        this.logger.logResponse(response)
        return response
      },
      (error) => {
        const apiError = handleAxiosError(error, 'API応答')

        this.logger.logError(error, 'Response error')

        notifyError(apiError)

        return Promise.reject(apiError)
      },
    )
  }

  private formatResponse<T>(response: any): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
    }
  }

  async get<T>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.executeWithRetry(async () => {
      const response = await this.client.get<T>(path, config)
      return this.formatResponse(response)
    })
  }

  async post<T>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.executeWithRetry(async () => {
      const response = await this.client.post<T>(path, data, config)
      return this.formatResponse(response)
    })
  }
}
