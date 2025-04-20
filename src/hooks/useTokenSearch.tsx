import useSWR, { SWRConfiguration } from 'swr'

type SearchParams = {
  name_like?: string
}

const BASE_URL = 'https://s1.xrplmeta.org'

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`検索に失敗しました (${response.status})`)
  }
  return response.json()
}

const buildSearchUrl = (params: SearchParams): string => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        searchParams.append(key, value.join(','))
      } else {
        searchParams.append(key, String(value))
      }
    }
  })
  return `${BASE_URL}/tokens?${searchParams.toString()}`
}

export const useTokenSearch = () => {
  return {}
}
