import { AxiosError } from 'axios'
import {
  ApiError,
  NetworkError,
  WalletError,
  TransactionError,
  UnexpectedError,
  ErrorCode,
  ErrorType,
  ErrorCodeType,
  CustomError,
} from '../../types/error'
import { notifyError } from './notify'

/**
 * AxiosエラーをApiErrorに変換する
 */
export const handleAxiosError = (
  error: AxiosError,
  context?: string,
): ApiError => {
  if (!error.response) {
    return new NetworkError({
      code: ErrorCode.NETWORK_ERROR,
      message: context
        ? `${context}：ネットワークエラーが発生しました`
        : 'ネットワークエラーが発生しました',
      severity: 'error',
      originalError: error,
    })
  }

  const statusCode = error.response.status
  let code: ErrorCodeType = ErrorCode.API_REQUEST_FAILED
  let message =
    (error.response.data as any)?.message || 'APIリクエストに失敗しました'
  let severity: 'error' | 'warning' | 'info' = 'error'

  if (context) {
    message = `${context}：${message}`
  }

  if (statusCode === 429) {
    code = ErrorCode.API_RATE_LIMIT
    message =
      'APIリクエスト上限に達しました。しばらく待ってから再試行してください'
    severity = 'warning'
  } else if (statusCode >= 500) {
    message =
      'サーバーエラーが発生しました。しばらく待ってから再試行してください'
  } else if (statusCode === 404) {
    message = 'リクエストされたリソースが見つかりませんでした'
  } else if (statusCode === 401 || statusCode === 403) {
    message = '認証に失敗しました'
  }

  return new ApiError({
    code,
    message,
    severity,
    statusCode,
    originalError: error,
    metadata: {
      url: error.config?.url,
      method: error.config?.method,
      data: error.response.data,
    },
  })
}

/**
 * ウォレット関連エラーを処理する
 */
export const handleWalletError = (
  error: Error | unknown,
  context?: string,
): WalletError => {
  let code: ErrorCodeType = ErrorCode.WALLET_NOT_CONNECTED
  let message = 'ウォレット接続エラーが発生しました'

  if (error instanceof Error) {
    const errorMsg = error.message.toLowerCase()

    if (
      errorMsg.includes('not installed') ||
      errorMsg.includes('は存在しません')
    ) {
      code = ErrorCode.WALLET_NOT_INSTALLED
      message = 'ウォレットがインストールされていません'
    } else if (errorMsg.includes('reject') || errorMsg.includes('拒否')) {
      code = ErrorCode.WALLET_USER_REJECTED
      message = 'ウォレット接続リクエストが拒否されました'
    } else if (
      errorMsg.includes('insufficient') ||
      errorMsg.includes('残高不足')
    ) {
      code = ErrorCode.WALLET_INSUFFICIENT_BALANCE
      message = '残高が不足しています'
    }
  }

  if (context) {
    message = `${context}：${message}`
  }

  return new WalletError({
    code,
    message,
    severity: 'error',
    originalError: error,
  })
}

/**
 * トランザクション関連エラーを処理する
 */
export const handleTransactionError = (
  error: Error | unknown,
  context?: string,
): TransactionError => {
  let code: ErrorCodeType = ErrorCode.TRANSACTION_FAILED
  let message = 'トランザクションの実行に失敗しました'

  if (error instanceof Error) {
    const errorMsg = error.message.toLowerCase()

    if (errorMsg.includes('timeout') || errorMsg.includes('タイムアウト')) {
      code = ErrorCode.TRANSACTION_TIMEOUT
      message = 'トランザクションがタイムアウトしました'
    } else if (errorMsg.includes('reject') || errorMsg.includes('拒否')) {
      code = ErrorCode.TRANSACTION_REJECTED
      message = 'トランザクションが拒否されました'
    }
  }

  if (context) {
    message = `${context}：${message}`
  }

  return new TransactionError({
    code,
    message,
    severity: 'error',
    originalError: error,
  })
}

/**
 * 一般的なエラーを適切なタイプのCustomErrorに変換する
 */
export const handleError = (
  error: Error | unknown,
  options?: {
    context?: string
    notify?: boolean
    type?: ErrorType
  },
): CustomError => {
  const { context, notify = true, type } = options || {}

  let customError: CustomError

  if (error instanceof CustomError) {
    customError = error
  } else if (error instanceof AxiosError) {
    customError = handleAxiosError(error, context)
  } else if (type === ErrorType.WALLET) {
    customError = handleWalletError(error, context)
  } else if (type === ErrorType.TRANSACTION) {
    customError = handleTransactionError(error, context)
  } else {
    const message =
      error instanceof Error ? error.message : 'エラーが発生しました'
    customError = new UnexpectedError({
      code: ErrorCode.UNEXPECTED_ERROR,
      message: context ? `${context}：${message}` : message,
      severity: 'error',
      originalError: error,
    })
  }

  if (notify) {
    notifyError(customError)
  }

  return customError
}

/**
 * エラーをログに記録する
 */
export const logError = (error: Error | unknown, context?: string): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `[ERROR]${context ? ` [${context}]` : ''}:`,
      error instanceof CustomError
        ? {
            code: error.code,
            message: error.message,
            type: error.type,
            statusCode: error.statusCode,
            originalError: error.originalError,
          }
        : error,
    )
  } else {
    console.error(
      `[ERROR]${context ? ` [${context}]` : ''}:`,
      error instanceof Error ? error.message : error,
    )
  }
}
