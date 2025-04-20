import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TokensApi } from '../tokens'
import {
  mockListTokensResponse,
  mockGetTokenResponse,
} from '../__fixtures__/tokens'

// yarn test src/libs/xrplmeta/__tests__/tokens.test.ts
// yarn test src/libs/xrplmeta/__tests__/tokens.test.ts --watch

describe('TokenAPI', () => {
  let tokensApi: TokensApi
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    global.fetch = fetchMock

    tokensApi = new TokensApi('https://test.api.com')
  })

  describe('listTokens', () => {
    it('正しいパラメータでリクエストを送信する', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockListTokensResponse),
      })

      const params = {
        name_like: 'USD',
        sort_by: 'marketcap' as const,
        limit: 20,
      }

      const response = await tokensApi.listTokens(params)

      expect(fetchMock).toHaveBeenCalledWith(
        'https://test.api.com/tokens?name_like=USD&sort_by=marketcap&limit=20',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      )

      expect(response).toEqual(mockListTokensResponse)
    })

    it('配列パラメータを正しくシリアライズする', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockListTokensResponse),
      })

      const params = {
        trust_level: [1, 2, 3] as Array<0 | 1 | 2 | 3>,
      }

      await tokensApi.listTokens(params)

      expect(fetchMock).toHaveBeenCalledWith(
        'https://test.api.com/tokens?trust_level=1,2,3',
        expect.any(Object),
      )
    })

    it('エラーレスポンスを適切に処理する', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
      })

      await expect(tokensApi.listTokens({})).rejects.toThrow('API error: 400')
    })

    it('undefinedパラメータを除外する', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockListTokensResponse),
      })

      const params = {
        name_like: 'USD',
        sort_by: undefined,
        limit: 20,
      }

      await tokensApi.listTokens(params)

      expect(fetchMock).toHaveBeenCalledWith(
        'https://test.api.com/tokens?name_like=USD&limit=20',
        expect.any(Object),
      )
    })
  })

  describe('getToken', () => {
    it('正しいパラメータで個別トークンを取得する', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGetTokenResponse),
      })

      const params = {
        identifier: 'USD:rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        include_sources: true,
      }

      const response = await tokensApi.getToken(params)

      expect(fetchMock).toHaveBeenCalledWith(
        'https://test.api.com/token/USD:rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B?include_sources=true',
        expect.any(Object),
      )

      expect(response).toEqual(mockGetTokenResponse)
    })

    it('クエリパラメータなしで正しく動作する', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGetTokenResponse),
      })

      await tokensApi.getToken({
        identifier: 'USD:rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
      })

      expect(fetchMock).toHaveBeenCalledWith(
        'https://test.api.com/token/USD:rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
        expect.any(Object),
      )
    })

    it('エラーレスポンスを適切に処理する', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(
        tokensApi.getToken({ identifier: 'INVALID:TOKEN' }),
      ).rejects.toThrow('API error: 404')
    })
  })

  describe('エッジケース', () => {
    it('ネットワークエラーを適切に処理する', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))

      await expect(tokensApi.listTokens({})).rejects.toThrow('Network error')
    })

    it('不正なJSONレスポンスを処理する', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      await expect(tokensApi.listTokens({})).rejects.toThrow('Invalid JSON')
    })
  })
})
