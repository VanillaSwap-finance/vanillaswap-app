'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Box, Button, Divider, IconButton, Typography } from '@mui/material'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import SwapAmountInput from '@/components/features/swap/SwapAmountInput'
import TokenSelectButton from '@/components/features/swap/TokenSelectButton'
import TokenSearchDialog from '@/components/features/swap/TokenSearchDialog'
import { useSwap } from '@/hooks/useSwap'
import { useWalletBalance } from '@/hooks/useWalletBalance'

export default function SwapContent() {
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

  const [openTokenSearchDialog, setOpenTokenSearchDialog] = useState(false)

  const { handleSwap } = useSwap()
  const { getXRPBalance } = useWalletBalance()

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

  useEffect(() => {}, [])

  const CustomBox = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{ border: 1, p: 1.5, borderRadius: 1 }}>{children}</Box>
  )

  return (
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
            <Typography variant="caption" sx={{ mb: 1 }}>
              1000.000
            </Typography>
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
            <Typography variant="caption" sx={{ mb: 1 }}>
              1000.000
            </Typography>
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
  )
}
