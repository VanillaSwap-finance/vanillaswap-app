import { vi, describe, it, expect, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/xrplmeta/token/route'
import { ApiClient } from '@/utils/axios/client'
import type { TokenResponse } from '@/app/api/xrplmeta/token/schema'

vi.mock('@/utils/axios/client', () => {
  const getMock = vi.fn()

  return {
    ApiClient: vi.fn().mockImplementation(() => ({
      get: getMock,
    })),
  }
})

// フィクスチャの定義
const createMockTokenData = (
  override?: Partial<TokenResponse>,
): TokenResponse => ({
  count: 1,
  tokens: [
    {
      currency: '4D494D494D490000000000000000000000000000',
      issuer: 'rMTnMGHk7k7brMC3vUNn7uP9t7WtLEdZUw',
      meta: {
        token: {
          name: 'TestToken',
          description: 'Test Description',
        },
        issuer: {
          kyc: false,
          name: 'TestIssuer',
        },
      },
      metrics: {
        trustlines: 4,
        holders: 2,
        supply: '1000000',
        marketcap: '1000',
        price: '1',
        volume_24h: '100',
        volume_7d: '700',
        exchanges_24h: 10,
        exchanges_7d: 70,
        takers_24h: 5,
        takers_7d: 35,
      },
    },
  ],
  ...override,
})

// ヘルパー関数
const createRequest = (params?: Record<string, string>) => {
  const url = new URL('http://localhost/api/xrplmeta/token')
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }
  return new NextRequest(url)
}

describe('XRPLMeta Token API Route', () => {
  let getMock: Mock

  beforeEach(() => {
    vi.clearAllMocks()
    getMock = (ApiClient as unknown as { (): { get: Mock } })().get
  })

  describe('GET /api/xrplmeta/token', () => {
    describe('when the request is successful', () => {
      it('should return token list with correct data and headers', async () => {
        // Arrange
        const mockTokenData = createMockTokenData()
        getMock.mockResolvedValueOnce({ data: mockTokenData })

        // Act
        const response = await GET(createRequest())
        const data = await response.json()

        // Assert
        expect(response.status).toBe(200)
        expect(data).toEqual(mockTokenData)
        expect(response.headers.get('Cache-Control')).toBe(
          'public, s-maxage=60, stale-while-revalidate=300',
        )
      })

      it('should handle search query parameter correctly', async () => {
        // Arrange
        const mockTokenData = createMockTokenData({ count: 0, tokens: [] })
        getMock.mockResolvedValueOnce({ data: mockTokenData })

        // Act
        await GET(createRequest({ nameLike: 'test' }))

        // Assert
        expect(getMock).toHaveBeenCalledWith('/tokens', {
          params: { nameLike: 'test' },
        })
      })
    })
  })
})
