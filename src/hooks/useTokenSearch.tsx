import useSWRInfinite from 'swr/infinite'
import { TOKEN_SEARCH, API_ENDPOINTS } from '@/constants/token'
import type { BaseToken } from '@/libs/xrplmeta/types'
import type { TokenQueryParams } from '@/app/api/xrplmeta/token/schema'

type SearchParams = Omit<TokenQueryParams, 'nameLike'> & {
  name_like?: string
  sort_by?: string
  trust_level?: number[]
  limit?: number
  offset?: number
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
  pageSize = TOKEN_SEARCH.DEFAULT_PAGE_SIZE,
): UseTokenSearchReturn => {
  const getKey = (
    pageIndex: number,
    previousPageData: { tokens: BaseToken[]; count: number } | null,
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
    useSWRInfinite<{ tokens: BaseToken[]; count: number }, Error>(
      getKey,
      async (key) => {
        try {
          const searchParams = new URLSearchParams()
          Object.entries(key).forEach(([k, v]) => {
            if (v !== undefined) {
              searchParams.append(k, String(v))
            }
          })

          const response = await fetch(
            `${API_ENDPOINTS.TOKEN_SEARCH}?${searchParams.toString()}`,
          )
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
            `Failed to search tokens: ${err instanceof Error ? err.message : String(err)}`,
          )
        }
      },
      {
        revalidateFirstPage: false,
        revalidateOnFocus: false,
        dedupingInterval: TOKEN_SEARCH.CACHE_INTERVAL,
        errorRetryCount: TOKEN_SEARCH.ERROR_RETRY_COUNT,
        errorRetryInterval: TOKEN_SEARCH.ERROR_RETRY_INTERVAL,
        shouldRetryOnError: true,
      },
    )

  const tokens = data ? data.flatMap((page) => page.tokens) : []
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
