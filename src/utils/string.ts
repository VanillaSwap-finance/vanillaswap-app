// 文字を省略して表示する
export const abbreviateString = (
  str: string,
  startDigits: number = 5,
  endDigits: number = 4,
) => {
  if (!str) return ''
  if (str.length <= startDigits + endDigits) return str

  const start = str.slice(0, startDigits)
  const end = str.slice(-endDigits)
  return `${start}...${end}`
}

/**
 * 16進数文字列をASCIIにデコードする関数。
 * - 文字数が4文字以上 → デコードを行う
 * - 3文字以下 → そのまま返却
 * @param hexString 対象の16進数文字列
 * @returns デコードされた文字列 or 元の文字列
 */
export const decodeHexToAscii = (hexString: string): string => {
  if (!hexString) {
    throw new Error('hexStringが空です')
  }

  // 3文字以下ならそのまま返す
  if (hexString.length <= 3) {
    return hexString
  }

  const buffer = Buffer.from(hexString, 'hex')
  const decoded = buffer.toString('ascii').replace(/\0+$/, '')
  return decoded
}
