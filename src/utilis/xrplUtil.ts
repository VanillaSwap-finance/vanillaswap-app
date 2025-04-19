/**
 * XRPの最小単位（drops）からXRPに変換
 * @param drops - XRPの最小単位（drops）
 * @returns XRPの数値
 */
export const dropsToXRP = (drops: string | number): number => {
  return Number(drops) / 1000000
}

/**
 * XRPからXRPの最小単位（drops）に変換
 * @param xrp - XRPの数値
 * @returns dropsの文字列
 */
export const xrpToDrops = (xrp: string | number): string => {
  return (Number(xrp) * 1000000).toString()
}

/**
 * XRPの最小単位（drops）の定数
 */
export const DROPS_PER_XRP = 1000000

/**
 * XRPの金額をフォーマット
 * @param xrp - XRPの数値
 * @param decimals - 小数点以下の桁数（デフォルト6桁）
 * @returns フォーマットされたXRPの文字列
 */
export const formatXRP = (
  xrp: number | string,
  decimals: number = 6,
): string => {
  return Number(xrp).toFixed(decimals)
}
