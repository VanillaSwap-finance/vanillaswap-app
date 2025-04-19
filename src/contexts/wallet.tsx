'use client'

import { createContext, useState } from 'react'
import type { Wallet } from '@/types/wallet'

export interface WalletContextType {
  wallet: Wallet | null
  setWallet: (wallet: Wallet) => void
  clearWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

interface WalletProviderProps {
  children: React.ReactNode
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [wallet, setWallet] = useState<Wallet | null>(null)

  const clearWallet = () => {
    setWallet(null)
  }

  return (
    <WalletContext.Provider value={{ wallet, setWallet, clearWallet }}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletContext
