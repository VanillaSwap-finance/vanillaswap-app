import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// カスタムconfig型の定義
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  requestId?: string
  startTime?: number
}

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

export interface LogMetadata {
  path?: string
  method?: string
  status?: number
  duration?: number
  error?: Error | AxiosError
  requestId?: string
  responseTime?: number
  requestData?: any
  responseData?: any
  [key: string]: any
}

export interface LoggerOptions {
  enabled?: boolean
  isDevelopment?: boolean
  logLevel?: LogLevel
  maskSensitiveData?: boolean
}

export class ApiLogger {
  private context: string
  private enabled: boolean
  private isDevelopment: boolean
  private logLevel: LogLevel
  private maskSensitiveData: boolean

  constructor(context: string, options: LoggerOptions = {}) {
    this.context = context
    this.enabled = options.enabled ?? true
    this.isDevelopment =
      options.isDevelopment ?? process.env.NODE_ENV === 'development'
    this.logLevel = options.logLevel ?? (this.isDevelopment ? 'debug' : 'info')
    this.maskSensitiveData = options.maskSensitiveData ?? true
  }

  info(message: string, metadata?: LogMetadata): void {
    this.log('info', message, metadata)
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.log('warn', message, metadata)
  }

  error(message: string, metadata?: LogMetadata): void {
    this.log('error', message, metadata)
  }

  debug(message: string, metadata?: LogMetadata): void {
    if (this.shouldLog('debug')) {
      this.log('debug', message, metadata)
    }
  }

  // Axiosインターセプター用のメソッド
  logRequest(config: InternalAxiosRequestConfig): void {
    if (!this.shouldLog('debug')) return

    const metadata: LogMetadata = {
      path: config.url,
      method: config.method?.toUpperCase(),
      requestData: this.maskSensitiveData
        ? this.maskSensitive(config.data)
        : config.data,
      requestId: this.generateRequestId(),
    }

    this.debug('Sending request', metadata)
  }

  logResponse(response: AxiosResponse): void {
    if (!this.shouldLog('debug')) return

    const config = response.config as CustomAxiosRequestConfig
    const duration = this.calculateResponseTime(config)
    const metadata: LogMetadata = {
      path: response.config.url,
      method: response.config.method?.toUpperCase(),
      status: response.status,
      duration,
      responseData: this.maskSensitiveData
        ? this.maskSensitive(response.data)
        : response.data,
      requestId: config.requestId,
    }

    this.debug('Response received', metadata)
  }

  logError(error: AxiosError | Error, context?: string): void {
    const metadata: LogMetadata = this.formatErrorMetadata(error)
    this.error(context || 'Request failed', metadata)
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false
    const levels: LogLevel[] = ['error', 'warn', 'info', 'debug']
    return levels.indexOf(level) <= levels.indexOf(this.logLevel)
  }

  private log(level: LogLevel, message: string, metadata?: LogMetadata): void {
    if (!this.shouldLog(level)) return

    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      context: this.context,
      message,
      ...this.formatMetadata(metadata),
    }

    if (this.isDevelopment) {
      console[level](
        `[${timestamp}] [${this.context}] [${level.toUpperCase()}] ${message}`,
        metadata,
      )
      return
    }

    console[level](JSON.stringify(logData))
  }

  private formatMetadata(metadata?: LogMetadata): Partial<LogMetadata> {
    if (!metadata) return {}

    if (metadata.error) {
      return {
        ...metadata,
        error: this.formatErrorMetadata(metadata.error),
      }
    }

    return this.maskSensitiveData ? this.maskSensitive(metadata) : metadata
  }

  private formatErrorMetadata(error: Error | AxiosError): any {
    const errorData: any = {
      message: error.message,
      name: error.name,
    }

    if (this.isDevelopment) {
      errorData.stack = error.stack
    }

    if (error instanceof AxiosError) {
      errorData.status = error.response?.status
      errorData.data = this.maskSensitiveData
        ? this.maskSensitive(error.response?.data)
        : error.response?.data
      errorData.config = {
        url: error.config?.url,
        method: error.config?.method,
      }
    }

    return errorData
  }

  private maskSensitive(data: any): any {
    if (!data) return data
    if (typeof data !== 'object') return data

    const masked = { ...data }
    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
    ]

    Object.keys(masked).forEach((key) => {
      if (
        sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))
      ) {
        masked[key] = '***MASKED***'
      } else if (typeof masked[key] === 'object') {
        masked[key] = this.maskSensitive(masked[key])
      }
    })

    return masked
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private calculateResponseTime(config: CustomAxiosRequestConfig): number {
    return config.startTime ? Date.now() - config.startTime : 0
  }
}
