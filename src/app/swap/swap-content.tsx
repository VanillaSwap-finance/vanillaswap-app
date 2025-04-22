'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Box, Button, Divider, IconButton, Typography, CircularProgress } from '@mui/material'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import SwapAmountInput from '@/components/features/swap/SwapAmountInput'
import TokenSelectButton from '@/components/features/swap/TokenSelectButton'
import TokenSearchDialog from '@/components/features/swap/TokenSearchDialog'
import { useSwap } from '@/hooks/useSwap'
import { useWallet } from '@/hooks/useWallet'
import { useWalletBalance } from '@/hooks/useWalletBalance'

export default function SwapContent() {
  const { isConnected } = useWallet()

  const router = useRouter()
  const searchParams = useSearchParams()

  const fromTokenSymbol = searchParams.get('fromTokenSymbol') || 'XRP'
  const fromTokenIssuer = searchParams.get('fromTokenIssuer') || 'XRP'
  const toTokenSymbol = searchParams.get('toTokenSymbol') || 'Mimimi'
  const toTokenIssuer =
    searchParams.get('toTokenIssuer') || 'rMTnMGHk7k7brMC3vUNn7uP9t7WtLEdZUw'
  const [selectingTokenPosition, setSelectingTokenPosition] = useState<
    'from' | 'to'
  >('from')
  
  const [fromTokenBalance, setFromTokenBalance] = useState<string>('0')
  const [toTokenBalance, setToTokenBalance] = useState<string>('0')
  
  const [isLoadingFromBalance, setIsLoadingFromBalance] = useState<boolean>(false)
  const [isLoadingToBalance, setIsLoadingToBalance] = useState<boolean>(false)

  const [openTokenSearchDialog, setOpenTokenSearchDialog] = useState(false)

  const { handleSwap } = useSwap()
  const { getTokenBalance } = useWalletBalance()

  const fetchFromTokenBalance = async () => {
    if (!isConnected) return
    
    setIsLoadingFromBalance(true)
    try {
      const balance = await getTokenBalance(fromTokenSymbol, fromTokenIssuer)
      setFromTokenBalance(balance)
    } catch (error) {
      console.error('[SwapContent] Error fetching from token balance: ', error)
      setFromTokenBalance('0')
    } finally {
      setIsLoadingFromBalance(false)
    }
  }

  const fetchToTokenBalance = async () => {
    if (!isConnected) return
    
    setIsLoadingToBalance(true)
    try {
      const balance = await getTokenBalance(toTokenSymbol, toTokenIssuer)
      setToTokenBalance(balance)
    } catch (error) {
      console.error('[SwapContent] Error fetching to token balance: ', error)
      setToTokenBalance('0')
    } finally {
      setIsLoadingToBalance(false)
    }
  }

  const handleSwichToken = () => {
    const params = new URLSearchParams(searchParams.toString())

    // FromとToを入れ替える
    const tempFromTokenSymbol = fromTokenSymbol
    const tempFromTokenIssuer = fromTokenIssuer
    const tempToTokenSymbol = toTokenSymbol
    const tempToTokenIssuer = toTokenIssuer

    params.set('fromTokenSymbol', tempToTokenSymbol)
    params.set('fromTokenIssuer', tempToTokenIssuer)
    params.set('toTokenSymbol', tempFromTokenSymbol)
    params.set('toTokenIssuer', tempFromTokenIssuer)

    router.push(`/swap?${params.toString()}`)
  }

  const handleSearchTokenDialogOpen = (side: 'from' | 'to') => {
    setSelectingTokenPosition(side)
    setOpenTokenSearchDialog(true)
  }

  const handleTokenSelect = (
    symbol: string,
    issuer: string,
    position: 'from' | 'to',
  ) => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectingTokenPosition === 'from') {
      params.set('fromTokenSymbol', symbol)
      params.set('fromTokenIssuer', issuer)
    } else {
      params.set('toTokenSymbol', symbol)
      params.set('toTokenIssuer', issuer)
    }

    router.push(`/swap?${params.toString()}`)
    setOpenTokenSearchDialog(false)
  }

  useEffect(() => {
    fetchFromTokenBalance()
  }, [isConnected, fromTokenSymbol, fromTokenIssuer, getTokenBalance])

  useEffect(() => {
    fetchToTokenBalance()
  }, [isConnected, toTokenSymbol, toTokenIssuer, getTokenBalance])

  const CustomBox = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{ border: 1, p: 1.5, borderRadius: 1 }}>{children}</Box>
  )

  const BalanceDisplay = ({ 
    balance, 
    isLoading 
  }: { 
    balance: string, 
    isLoading: boolean 
  }) => (
    <Typography variant="caption" sx={{ mb: 1, minWidth: '80px', textAlign: 'right' }}>
      {isLoading ? (
        <CircularProgress size={12} sx={{ mr: 1 }} />
      ) : (
        balance
      )}
    </Typography>
  )

  return (
    <>
      {isConnected ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <CustomBox>
            <Typography variant="h6">Swap</Typography>
          </CustomBox>
          <CustomBox>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ mb: 1 }}>
                  From
                </Typography>
                {/* From token balance */}
                <BalanceDisplay 
                  balance={fromTokenBalance} 
                  isLoading={isLoadingFromBalance} 
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'grey.200',
                  borderRadius: 1,
                  height: 60,
                  px: 2,
                }}
              >
                <TokenSelectButton
                  token={fromTokenSymbol}
                  onClose={() => handleSearchTokenDialogOpen('from')}
                />
                <SwapAmountInput />
              </Box>
            </Box>

            <Box sx={{ position: 'relative', my: 4 }}>
              <Divider />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.paper',
                  p: 0.5,
                }}
              >
                <IconButton
                  color="inherit"
                  sx={{
                    minWidth: 'auto',
                    px: 1,
                  }}
                  onClick={handleSwichToken}
                >
                  <SwapVertIcon />
                </IconButton>
              </Box>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ mb: 1 }}>
                  To
                </Typography>
                {/* To token balance */}
                <BalanceDisplay 
                  balance={toTokenBalance} 
                  isLoading={isLoadingToBalance} 
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'grey.200',
                  borderRadius: 1,
                  height: 60,
                  px: 2,
                }}
              >
                <TokenSelectButton
                  token={toTokenSymbol}
                  onClose={() => handleSearchTokenDialogOpen('to')}
                />
                <SwapAmountInput />
              </Box>
            </Box>
          </CustomBox>
          <CustomBox>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disableElevation
              onClick={handleSwap}
            >
              Swap
            </Button>
          </CustomBox>

          <TokenSearchDialog
            open={openTokenSearchDialog}
            onClose={() => setOpenTokenSearchDialog(false)}
            onTokenSelect={handleTokenSelect}
            side={selectingTokenPosition}
          />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Wallet is not Connected
          </Typography>
        </Box>
      )}
    </>
  )
}
