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

/**
 * トークン価格のフォーマット処理
 * @param price - フォーマットする価格
 * @returns フォーマットされた価格文字列
 */
export const formatTokenPrice = (price: number): string => {
  // 無効な値のチェック
  if (!price || isNaN(price)) return '0'

  // 価格の大きさに応じて小数点以下の桁数を調整
  let decimals: number
  if (price >= 1000) {
    decimals = 2 // 1000以上は小数点2桁まで (例: 40770.22)
  } else if (price >= 1) {
    decimals = 4 // 1以上は小数点4桁まで (例: 123.4567)
  } else if (price >= 0.0001) {
    decimals = 6 // 0.0001以上は小数点6桁まで (例: 0.123456)
  } else {
    decimals = 10 // 非常に小さい値は小数点10桁まで (例: 0.0000001234)
  }

  // 指定した桁数でフォーマット
  const formattedPrice = formatNumber(price, decimals)

  // 末尾の不要な0を削除
  return formattedPrice.replace(/\.?0+$/, '')
}
