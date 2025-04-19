export type Address = string

export enum ChainTypes {
  XRPL = 'xrpl',
}

export type ChainType = (typeof ChainTypes)[keyof typeof ChainTypes]

export enum NetworkTypes {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export type NetworkType = (typeof NetworkTypes)[keyof typeof NetworkTypes]

export type Wss = string

export interface Wallet {
  address: Address
  chain: ChainType
  network: NetworkType
  wss: Wss
}
