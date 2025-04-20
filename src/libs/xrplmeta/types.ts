// 共通の型定義
export type AssetClass = 'fiat' | 'commodity' | 'equity' | 'cryptocurrency'
export type WebLinkType =
  | 'website'
  | 'socialmedia'
  | 'support'
  | 'sourcecode'
  | 'whitepaper'
  | 'audit'
  | 'report'
export type SortBy =
  | 'trustlines'
  | 'holders'
  | 'supply'
  | 'marketcap'
  | `${'trustlines' | 'holders' | 'supply' | 'marketcap'}_delta_24h`
  | `${'trustlines' | 'holders' | 'supply' | 'marketcap'}_percent_24h`
  | `${'trustlines' | 'holders' | 'supply' | 'marketcap'}_delta_7d`
  | `${'trustlines' | 'holders' | 'supply' | 'marketcap'}_percent_7d`

// 基本的なトークン情報の型
export interface BaseToken {
  currency: string
  issuer: string
  meta: TokenMetadata
  metrics: TokenMetrics
}

export interface TokenMetadata {
  token: TokenMeta
  issuer: IssuerMeta
}

export interface TokenMeta {
  name: string
  description: string
  icon: string
  trust_level: 0 | 1 | 2 | 3
  asset_class?: AssetClass
  weblinks: WebLink[]
}

export interface IssuerMeta {
  name: string
  description: string
  icon: string
  kyc: boolean
  trust_level: 0 | 1 | 2 | 3
  weblinks: WebLink[]
}

export interface WebLink {
  url: string
  type: WebLinkType
  title: string
}

export interface TokenMetrics {
  trustlines: number
  holders: number
  supply: string
  marketcap: string
  price: string
  volume_24h: string
  volume_7d: string
  exchanges_24h: string
  exchanges_7d: string
  takers_24h: string
  takers_7d: string
}

// List Tokens のパラメータと応答の型
export interface ListTokensParams {
  name_like?: string
  expand_meta?: boolean
  include_changes?: boolean
  sort_by?: SortBy
  trust_level?: (0 | 1 | 2 | 3)[]
  limit?: number
  offset?: number
}

export interface ListTokensResponse {
  tokens: BaseToken[]
  count: number
}

// Get Token のパラメータと応答の型
export interface GetTokenParams {
  identifier: string
  include_sources?: boolean
  include_changes?: boolean
}

export type GetTokenResponse = BaseToken
