export const TOKEN_SEARCH = {
  DEFAULT_PAGE_SIZE: 20, // デフォルトのページサイズ
  CACHE_INTERVAL: 5000, // キャッシュの有効期間（ミリ秒）
  ERROR_RETRY_COUNT: 3, // エラー時の再試行回数
  ERROR_RETRY_INTERVAL: 1000, // エラー時の再試行間隔（ミリ秒）
} as const

export const API_ENDPOINTS = {
  TOKEN_SEARCH: '/api/xrplmeta/token',
} as const
