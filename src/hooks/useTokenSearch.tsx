import useSWRInfinite from 'swr/infinite'
import type {
  BaseToken,
} from '@/libs/xrplmeta/types'
import type { TokenQueryParams } from '@/app/api/xrplmeta/token/schema'

type SearchParams = Omit<TokenQueryParams, 'nameLike'> & {
  name_like?: string;
  sort_by?: string;
  trust_level?: number[];
  limit?: number;
  offset?: number;
}

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
    previousPageData: { tokens: BaseToken[], count: number } | null,
  ) => {
    if (previousPageData && !previousPageData.tokens.length) return null

    const apiParams: Record<string, string> = {}
    
    if (params.name_like) {
      apiParams.nameLike = params.name_like
    }
    
    return {
      ...apiParams,
      limit: pageSize,
      offset: pageIndex * pageSize,
    }
  }

  const { data, error, size, setSize, isLoading, isValidating } =
    useSWRInfinite<{ tokens: BaseToken[], count: number }, Error>(
      getKey,
      async (key) => {
        try {
          const searchParams = new URLSearchParams()
          Object.entries(key).forEach(([k, v]) => {
            if (v !== undefined) {
              searchParams.append(k, String(v))
            }
          })
          
          const response = await fetch(`/api/xrplmeta/token?${searchParams.toString()}`)
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
          }
          
          const data = await response.json()
          
          // レスポンスの形式を確認
          if (!data || !Array.isArray(data.tokens)) {
            throw new Error('Invalid response format')
          }
          return data
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
    ? data.flatMap((page) => page.tokens)
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
