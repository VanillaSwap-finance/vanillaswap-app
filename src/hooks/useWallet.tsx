import { useContext } from 'react'
import { isInstalled, getAddress, getNetwork } from '@gemwallet/api'
import { WALLET_TYPES } from '@/constants/wallet'
import { getChainType, getNetworkType } from '@/utils/wallet'
import { handleError, logError } from '@/utils/error'
import { ErrorType } from '@/types/error'
import WalletContext from '@/contexts/wallet'

export type WalletType = (typeof WALLET_TYPES)[keyof typeof WALLET_TYPES]

export const useWallet = () => {
  const walletContext = useContext(WalletContext)

  if (!walletContext) {
    throw new Error('Wallet context not found')
  }

  const { wallet, setWallet, clearWallet } = walletContext

  const connect = async (walletType: WalletType) => {
    try {
      switch (walletType) {
        case WALLET_TYPES.GEM_WALLET:
          const { result } = await isInstalled()

          if (!result.isInstalled) {
            throw new Error(WALLET_TYPES.GEM_WALLET + ' is not installed')
          }

          const addressResponse = await getAddress()

          if (addressResponse.type === 'reject') {
            throw new Error('User rejected the request')
          }

          if (addressResponse.type !== 'response') {
            throw new Error('Unknown error')
          }

          const networkResponse = await getNetwork()

          if (networkResponse.type === 'reject') {
            throw new Error('User rejected the request')
          }

          if (networkResponse.type !== 'response') {
            throw new Error('Unknown error')
          }

          setWallet({
            address: addressResponse.result?.address as string,
            chain: getChainType(networkResponse.result?.chain as string),
            network: getNetworkType(networkResponse.result?.network as string),
            wss: networkResponse.result?.websocket as string,
          })
          break
        default:
          throw new Error('Unsupported wallet type')
      }
    } catch (error: any) {
      logError(error, 'ウォレット接続')
      throw handleError(error, {
        context: 'ウォレット接続',
        type: ErrorType.WALLET,
        notify: false,
      })
    }
  }

  const disconnect = () => {
    clearWallet()
  }

  return {
    isConnected: !!wallet,
    wallet,
    connect,
    disconnect,
  }
}
