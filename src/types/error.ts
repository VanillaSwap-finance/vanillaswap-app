/**
 * エラー重要度
 */
export type ErrorSeverity = 'error' | 'warning' | 'info'

/**
 * エラー種別
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  WALLET = 'WALLET',
  TRANSACTION = 'TRANSACTION',
  UNEXPECTED = 'UNEXPECTED',
}

/**
 * エラーコード定義
 */
export const ErrorCode = {
  NETWORK_OFFLINE: 'NETWORK_OFFLINE',
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  NETWORK_ERROR: 'NETWORK_ERROR',

  API_REQUEST_FAILED: 'API_REQUEST_FAILED',
  API_RESPONSE_INVALID: 'API_RESPONSE_INVALID',
  API_RATE_LIMIT: 'API_RATE_LIMIT',

  WALLET_NOT_INSTALLED: 'WALLET_NOT_INSTALLED',
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  WALLET_USER_REJECTED: 'WALLET_USER_REJECTED',
  WALLET_INSUFFICIENT_BALANCE: 'WALLET_INSUFFICIENT_BALANCE',

  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  TRANSACTION_REJECTED: 'TRANSACTION_REJECTED',
  TRANSACTION_TIMEOUT: 'TRANSACTION_TIMEOUT',

  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode]

/**
 * 基本エラーインターフェース
 */
export interface BaseError {
  code: ErrorCodeType
  message: string
  severity: ErrorSeverity
  type: ErrorType
  statusCode?: number
  originalError?: Error | unknown
  metadata?: Record<string, unknown>
}

/**
 * カスタムエラー基底クラス
 */
export class CustomError extends Error implements BaseError {
  code: ErrorCodeType
  severity: ErrorSeverity
  type: ErrorType
  statusCode?: number
  originalError?: Error | unknown
  metadata?: Record<string, unknown>

  constructor(options: {
    code: ErrorCodeType
    message: string
    severity?: ErrorSeverity
    type: ErrorType
    statusCode?: number
    originalError?: Error | unknown
    metadata?: Record<string, unknown>
  }) {
    super(options.message)
    this.name = this.constructor.name
    this.code = options.code
    this.severity = options.severity || 'error'
    this.type = options.type
    this.statusCode = options.statusCode
    this.originalError = options.originalError
    this.metadata = options.metadata

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

/**
 * エラーオプションインターフェース
 */
export interface ErrorOptions {
  code: ErrorCodeType
  message: string
  severity?: ErrorSeverity
  statusCode?: number
  originalError?: Error | unknown
  metadata?: Record<string, unknown>
}

/**
 * ネットワークエラークラス
 */
export class NetworkError extends CustomError {
  constructor(options: ErrorOptions) {
    super({ ...options, type: ErrorType.NETWORK })
  }
}

/**
 * APIエラークラス
 */
export class ApiError extends CustomError {
  constructor(options: ErrorOptions) {
    super({ ...options, type: ErrorType.API })
  }
}

/**
 * ウォレットエラークラス
 */
export class WalletError extends CustomError {
  constructor(options: ErrorOptions) {
    super({ ...options, type: ErrorType.WALLET })
  }
}

/**
 * トランザクションエラークラス
 */
export class TransactionError extends CustomError {
  constructor(options: ErrorOptions) {
    super({ ...options, type: ErrorType.TRANSACTION })
  }
}

/**
 * 予期せぬエラークラス
 */
export class UnexpectedError extends CustomError {
  constructor(options: ErrorOptions) {
    super({ ...options, type: ErrorType.UNEXPECTED })
  }
}
