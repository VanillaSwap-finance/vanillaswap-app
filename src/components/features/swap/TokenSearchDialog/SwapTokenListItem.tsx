'use client'

import { Box, Avatar, Typography, Tooltip } from '@mui/material'
import { abbreviateString } from '@/utils/string'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'

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
        {/* 左側：トークン基本情報 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={
              icon === 'https://s1.xrplmeta.org/icon/null.null'
                ? '/images/default-token.svg'
                : icon
            }
            alt={symbol}
            sx={{ width: 38, height: 38 }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {symbol}
              </Typography>
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {name}
              </Typography>
              {description && (
                <Tooltip title={description} arrow>
                  <InfoOutlinedIcon
                    sx={{ fontSize: 16, color: 'text.secondary', mb: 0.5 }}
                  />
                </Tooltip>
              )}
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                lineHeight: 1,
              }}
            >
              {abbreviateString(issuer)}
            </Typography>
          </Box>
        </Box>

        {/* 右側：メトリクス */}
        {metrics && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Holders" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PeopleOutlineIcon
                  sx={{ fontSize: 14, color: 'text.secondary' }}
                />
                <Typography variant="caption" color="text.secondary">
                  {metrics.holders}
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Price" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  $ {metrics.price}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  )
}
