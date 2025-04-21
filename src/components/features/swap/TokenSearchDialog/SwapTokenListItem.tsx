'use client'

import { Box, Typography, Tooltip } from '@mui/material'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import TokenBasicInfo from '@/components/features/swap/TokenSearchDialog/TokenBasicInfo'
import TokenMetrics from '@/components/features/swap/TokenSearchDialog/TokenMetrics'

interface SwapTokenListItemProps {
  symbol: string
  name: string
  issuer: string
  onTokenSelect: (
    symbol: string,
    issuer: string,
    position: 'from' | 'to',
  ) => void
  side: 'from' | 'to'
  icon?: string
  metrics?: {
    holders: string
    price: string
  }
  description?: string
}

export default function SwapTokenListItem({
  symbol,
  name,
  issuer,
  onTokenSelect,
  side,
  icon,
  metrics,
  description,
}: SwapTokenListItemProps) {
  return (
    <Box
      onClick={() => onTokenSelect(symbol, issuer, side)}
      sx={{
        px: 2,
        py: 1.2,
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        transition: 'background-color 0.2s',
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TokenBasicInfo
          symbol={symbol}
          name={name}
          icon={icon}
          issuer={issuer}
          description={description}
        />
        {metrics && (
          <TokenMetrics holders={metrics.holders} price={metrics.price} />
        )}
      </Box>
    </Box>
  )
}
