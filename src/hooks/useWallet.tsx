import { useEffect, useState } from 'react'
import { isInstalled, getAddress } from '@gemwallet/api'
import { WALLET_TYPES } from '@/constants/wallet'

export type WalletType = (typeof WALLET_TYPES)[keyof typeof WALLET_TYPES]

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false)

  const connect = async (walletType: WalletType) => {
    try {
      switch (walletType) {
        case WALLET_TYPES.GEM_WALLET:
          const { result } = await isInstalled()

          if (!result.isInstalled) {
            throw new Error(WALLET_TYPES.GEM_WALLET + ' is not installed')
          }

          const response = await getAddress()

          if (response.type === 'reject') {
            throw new Error('User rejected the request')
          }

          if (response.type !== 'response') {
            throw new Error('Unknown error')
          }

          console.log('response: ', response.result?.address)
          setIsConnected(true)
          break
        default:
          throw new Error('Unsupported wallet type')
      }
    } catch (error: any) {
      console.error('[useWallet] Error connecting to wallet: ', error)
      throw error
    }
  }

  const disconnect = () => {}

  return {
    isConnected,
    connect,
    disconnect,
  }
}
