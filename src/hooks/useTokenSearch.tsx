import useSWRInfinite from 'swr/infinite'
import {
  ListTokensParams,
  ListTokensResponse,
  BaseToken,
} from '@/libs/xrplmeta/types'
import { tokensApi } from '@/libs/xrplmeta/tokens'

type SearchParams = ListTokensParams

export interface UseTokenSearchReturn {
  tokens: BaseToken[]
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  total: number
  loadMore: () => void
  isLoadingMore: boolean
  hasMore: boolean
  error?: Error
}

export const useTokenSearch = (
  params: SearchParams = {},
  pageSize = 20,
): UseTokenSearchReturn => {
  const getKey = (
    pageIndex: number,
    previousPageData: ListTokensResponse | null,
  ) => {
    if (previousPageData && !previousPageData.tokens.length) return null

    return {
      ...params,
      limit: pageSize,
      offset: pageIndex * pageSize,
    }
  }

  const { data, error, size, setSize, isLoading, isValidating } =
    useSWRInfinite<ListTokensResponse, Error>(
      getKey,
      async (key: ListTokensParams) => {
        try {
          const response = await tokensApi.listTokens(key)
          // レスポンスの形式を確認
          if (!response || !Array.isArray(response.tokens)) {
            throw new Error('Invalid response format')
          }
          return response
        } catch (err) {
          console.error('Token search error:', err)
          throw new Error(
            `トークン検索に失敗しました: ${err instanceof Error ? err.message : String(err)}`,
          )
        }
      },
      {
        revalidateFirstPage: false,
        revalidateOnFocus: false,
        dedupingInterval: 5000, // 5秒間は同じリクエストをキャッシュ
        errorRetryCount: 3, // エラー時の再試行回数
        errorRetryInterval: 1000, // エラー時の再試行間隔（ミリ秒）
        shouldRetryOnError: true, // エラー時に再試行を行う
      },
    )

  const tokens = data
    ? data.flatMap((page: ListTokensResponse) => page.tokens)
    : []
  const isEmpty = data?.[0]?.tokens.length === 0
  const total = data?.[0]?.count || 0
  const hasMore = tokens.length < total
  const isLoadingMore = isValidating && !!data && size > 1

  return {
    tokens,
    isLoading,
    isError: !!error,
    error,
    isEmpty,
    total,
    loadMore: () => setSize(size + 1),
    isLoadingMore,
    hasMore,
  }
}
