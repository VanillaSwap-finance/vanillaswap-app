import { useContext, useCallback } from 'react'
import WalletContext from '@/contexts/wallet'
import { XRPLBalance } from '@/libs/xrpl/balance'

export const useWalletBalance = () => {
  const walletContext = useContext(WalletContext)

  if (!walletContext) {
    throw new Error('Wallet context not found')
  }

  const { wallet } = walletContext

  const getXRPBalance = useCallback(async (): Promise<string> => {
    if (!wallet?.address || !wallet?.wss) {
      return '0.000'
    }

    try {
      return await XRPLBalance.getXRPBalance(wallet.address, wallet.wss)
    } catch (error) {
      console.error('[useWalletBalance] Error getting XRP balance: ', error)
      return '0.000'
    }
  }, [wallet?.address, wallet?.wss])

  const getTokenBalance = useCallback(
    async (currency: string, issuer: string): Promise<string> => {
      if (!wallet?.address || !wallet?.wss) {
        return '0'
      }

      try {
        return await XRPLBalance.getTokenBalance(
          wallet.address,
          wallet.wss,
          currency,
          issuer,
        )
      } catch (error) {
        console.error('[useWalletBalance] Error getting token balance: ', error)
        return '0'
      }
    },
    [wallet?.address, wallet?.wss],
  )

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
