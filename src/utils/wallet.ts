import { ChainTypes, NetworkTypes } from '@/types/wallet'
import type { ChainType, NetworkType } from '@/types/wallet'

export const getChainType = (chain: string): ChainType => {
  switch (chain) {
    case 'XRPL':
      return ChainTypes.XRPL
    default:
      throw new Error('Unsupported chain')
  }
}

export const getNetworkType = (network: string): NetworkType => {
  switch (network) {
    case 'Mainnet':
      return NetworkTypes.MAINNET
    case 'Testnet':
      return NetworkTypes.TESTNET
    default:
      throw new Error('Unsupported network')
  }
}
