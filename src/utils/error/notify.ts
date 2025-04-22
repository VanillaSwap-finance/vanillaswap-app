import {
  enqueueSnackbar,
  closeSnackbar,
  VariantType,
  SnackbarKey,
} from 'notistack'
import {
  BaseError,
  CustomError,
  ErrorSeverity,
  ErrorType,
  ErrorCode,
} from '../../types/error'

const activeErrorKeys = new Set<string>()

const lastErrorTimes = new Map<string, number>()

const generateErrorKey = (error: BaseError): string => {
  return `${error.type}_${error.code}_${error.message}`
}

const severityToVariant = (severity: ErrorSeverity): VariantType => {
  switch (severity) {
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    default:
      return 'default'
  }
}

const isDev = process.env.NODE_ENV === 'development'

interface NotifyOptions {
  preventDuplicates?: boolean
  cooldownMs?: number
  autoHideDuration?: number
}

/**
 * エラー通知を表示する
 */
export const notifyError = (
  error: Error | CustomError | BaseError | unknown,
  options: NotifyOptions = {},
): SnackbarKey | null => {
  const defaultOptions = {
    preventDuplicates: true,
    cooldownMs: 3000, // 同じエラーを再表示するまでの最小時間（ミリ秒）
    autoHideDuration: 5000,
  }

  const mergedOptions = { ...defaultOptions, ...options }

  const normalizedError = normalizeError(error)

  const errorKey = generateErrorKey(normalizedError)

  if (mergedOptions.preventDuplicates && activeErrorKeys.has(errorKey)) {
    return null
  }

  const now = Date.now()
  const lastTime = lastErrorTimes.get(errorKey) || 0
  if (now - lastTime < mergedOptions.cooldownMs) {
    return null
  }

  let message = normalizedError.message

  if (isDev) {
    message = `[${normalizedError.code}] ${message}`

    if (normalizedError.type === ErrorType.API && normalizedError.statusCode) {
      message = `[${normalizedError.statusCode}] ${message}`
    }
  }

  const snackbarKey = enqueueSnackbar(message, {
    variant: severityToVariant(normalizedError.severity),
    autoHideDuration: mergedOptions.autoHideDuration,
    onClose: () => {
      activeErrorKeys.delete(errorKey)
    },
  })

  activeErrorKeys.add(errorKey)
  lastErrorTimes.set(errorKey, now)

  return snackbarKey
}

/**
 * 成功通知を表示する
 */
export const notifySuccess = (
  message: string,
  options: NotifyOptions = {},
): SnackbarKey => {
  return enqueueSnackbar(message, {
    variant: 'success',
    autoHideDuration: options.autoHideDuration || 5000,
  })
}

/**
 * 情報通知を表示する
 */
export const notifyInfo = (
  message: string,
  options: NotifyOptions = {},
): SnackbarKey => {
  return enqueueSnackbar(message, {
    variant: 'info',
    autoHideDuration: options.autoHideDuration || 5000,
  })
}

/**
 * 警告通知を表示する
 */
export const notifyWarning = (
  message: string,
  options: NotifyOptions = {},
): SnackbarKey => {
  return enqueueSnackbar(message, {
    variant: 'warning',
    autoHideDuration: options.autoHideDuration || 5000,
  })
}

/**
 * 任意のエラーをBaseError形式に正規化する
 */
export const normalizeError = (error: unknown): BaseError => {
  if (error instanceof CustomError) {
    return error
  }

  if (error instanceof Error) {
    return {
      code: ErrorCode.UNEXPECTED_ERROR,
      message: error.message || 'An unexpected error occurred',
      severity: 'error',
      type: ErrorType.UNEXPECTED,
      originalError: error,
    }
  }

  if (typeof error === 'string') {
    return {
      code: ErrorCode.UNEXPECTED_ERROR,
      message: error,
      severity: 'error',
      type: ErrorType.UNEXPECTED,
    }
  }

  return {
    code: ErrorCode.UNEXPECTED_ERROR,
    message: 'An unexpected error occurred',
    severity: 'error',
    type: ErrorType.UNEXPECTED,
    originalError: error,
  }
}

/**
 * 通知をすべて閉じる
 */
export const dismissAllNotifications = (): void => {
  closeSnackbar()
  activeErrorKeys.clear()
}
