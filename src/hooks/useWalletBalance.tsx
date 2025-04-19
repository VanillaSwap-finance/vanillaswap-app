import { useContext } from 'react'
import WalletContext from '@/contexts/wallet'
import { getXRPLBalance } from '@/libs/xrpl/balance'

export const useWalletBalance = () => {
  const walletContext = useContext(WalletContext)

  if (!walletContext) {
    throw new Error('Wallet context not found')
  }

  const { wallet } = walletContext

  const getXRPBalance = async (): Promise<string> => {
    if (!wallet) return '0.000'

    try {
      const balance = await getXRPLBalance(wallet.address, wallet.wss)
      return balance
    } catch (error) {
      console.error('[getXRPBalance] Error getting XRP balance: ', error)
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
