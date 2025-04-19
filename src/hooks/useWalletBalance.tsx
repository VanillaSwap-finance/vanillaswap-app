import { useContext } from 'react'
import WalletContext from '@/contexts/wallet'
import { XRPLBalance } from '@/libs/xrpl/balance'
import { XRPLClient } from '@/libs/xrpl/client'

export const useWalletBalance = () => {
  const walletContext = useContext(WalletContext)

  if (!walletContext) {
    throw new Error('Wallet context not found')
  }

  const { wallet } = walletContext

  const getXRPBalance = async (): Promise<string> => {
    if (!wallet?.address || !wallet?.wss) {
      return '0.000'
    }

    try {
      return await XRPLBalance.getXRPBalance(wallet.address, wallet.wss)
    } catch (error) {
      console.error('[useWalletBalance] Error getting XRP balance: ', error)
      return '0.000'
    }
  }

  const getTokenBalance = async () => {
    return 0
  }

  const getBatchBalances = async () => {
    return {
      XRP: 0,
      MIMIMI: 0,
    }
  }

  const subscribeToBalanceUpdates = async () => {
    return () => {}
  }

  return {
    getXRPBalance,
    getTokenBalance,
    getBatchBalances,
    subscribeToBalanceUpdates,
  }
}
