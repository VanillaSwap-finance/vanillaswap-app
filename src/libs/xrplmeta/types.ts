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
