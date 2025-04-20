/**
 * 数値を指定された小数点以下の桁数で丸める
 * @param value 対象の数値
 * @param decimals 小数点以下の桁数
 * @returns 丸められた数値
 */
export const round = (value: number, decimals: number = 0): number => {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * 数値を通貨形式にフォーマットする
 * @param value 対象の数値
 * @param locale ロケール（デフォルト: 'ja-JP'）
 * @param currency 通貨コード（デフォルト: 'JPY'）
 * @returns フォーマットされた文字列
 */
export const formatCurrency = (
  value: number,
  locale: string = 'ja-JP',
  currency: string = 'JPY',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value)
}

/**
 * 文字列を数値に変換する（失敗時はデフォルト値を返す）
 * @param value 変換対象の文字列
 * @param defaultValue 変換失敗時のデフォルト値
 * @returns 変換された数値またはデフォルト値
 */
export const parseNumber = (
  value: string,
  defaultValue: number = 0,
): number => {
  const parsed = Number(value)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * 数値を指定された範囲内に収める
 * @param value 対象の数値
 * @param min 最小値
 * @param max 最大値
 * @returns 範囲内に収められた数値
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * 数値を百分率形式にフォーマットする
 * @param value 対象の数値（0-1の範囲）
 * @param decimals 小数点以下の桁数
 * @returns フォーマットされた文字列
 */
export const formatPercentage = (
  value: number,
  decimals: number = 0,
): string => {
  const percentage = round(value * 100, decimals)
  return `${percentage}%`
}

/**
 * 数値をカンマ区切りでフォーマットする
 * @param value 対象の数値または文字列
 * @param decimals 小数点以下の桁数（デフォルト: 0）
 * @param defaultValue 変換失敗時のデフォルト値（デフォルト: 0）
 * @returns フォーマットされた文字列
 */
export const formatNumber = (
  value: number | string,
  decimals: number = 0,
  defaultValue: number = 0,
): string => {
  const numValue =
    typeof value === 'string' ? parseNumber(value, defaultValue) : value
  const roundedValue = round(numValue, decimals)
  return new Intl.NumberFormat('ja-JP', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(roundedValue)
}
