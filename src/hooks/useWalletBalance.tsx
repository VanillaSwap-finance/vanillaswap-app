import { useContext } from 'react'
import WalletContext from '@/contexts/wallet'

export const useWalletBalance = () => {
  const walletContext = useContext(WalletContext)

  if (!walletContext) {
    throw new Error('Wallet context not found')
  }

  const { wallet } = walletContext

  const getXRPBalance = async () => {
    return 0
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
