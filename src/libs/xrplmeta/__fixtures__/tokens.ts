export const mockToken = {
  currency: 'USD',
  issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
  meta: {
    token: {
      name: 'USD',
      description: 'US Dollar',
      icon: 'https://example.com/usd.png',
      trust_level: 3,
      asset_class: 'fiat',
      weblinks: [
        {
          url: 'https://example.com',
          type: 'website',
          title: 'Official Website',
        },
      ],
    },
    issuer: {
      name: 'Bitstamp',
      description: 'Bitstamp USD Gateway',
      icon: 'https://example.com/bitstamp.png',
      kyc: true,
      trust_level: 3,
      weblinks: [],
    },
  },
  metrics: {
    trustlines: 1000,
    holders: 800,
    supply: '1000000.00',
    marketcap: '1000000.00',
    price: '1.00',
    volume_24h: '100000.00',
    volume_7d: '700000.00',
    exchanges_24h: '1000',
    exchanges_7d: '7000',
    takers_24h: '500',
    takers_7d: '3500',
  },
}

export const mockListTokensResponse = {
  tokens: [mockToken],
  count: 1,
}

export const mockGetTokenResponse = mockToken
