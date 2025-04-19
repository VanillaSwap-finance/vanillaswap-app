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
