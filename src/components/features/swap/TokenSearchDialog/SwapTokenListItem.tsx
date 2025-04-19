'use client'

import { Box, Avatar, Typography } from '@mui/material'
import { abbreviateString } from '@/utilis/stringUtil'

interface SwapTokenListItemProps {
  symbol: string
  issuer: string
  onTokenSelect: (
    symbol: string,
    issuer: string,
    position: 'from' | 'to',
  ) => void
  side: 'from' | 'to'
}

export default function SwapTokenListItem({
  symbol,
  issuer,
  onTokenSelect,
  side,
}: SwapTokenListItemProps) {
  return (
    <Box
      onClick={() => onTokenSelect(symbol, issuer, side)}
      sx={{
        px: 2,
        py: 1.2,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1,
        borderRadius: 1,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        transition: 'background-color 0.2s',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar src="/images/xrp.png" sx={{ width: 36, height: 36, mr: 0.5 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {symbol}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {abbreviateString(issuer)}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body1">1000</Typography>
      </Box>
    </Box>
  )
}
