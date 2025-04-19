'use client'

import { WalletProvider } from '@/contexts/wallet'

export default function WalletContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <WalletProvider>{children}</WalletProvider>
}
