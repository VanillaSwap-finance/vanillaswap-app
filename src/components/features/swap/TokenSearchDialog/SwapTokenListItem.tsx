'use client'

import { Box, Avatar, Typography, Tooltip } from '@mui/material'
import { abbreviateString } from '@/utils/string'
import VerifiedIcon from '@mui/icons-material/Verified'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import ShowChartIcon from '@mui/icons-material/ShowChart'

interface SwapTokenListItemProps {
  symbol: string
  issuer: string
  onTokenSelect: (
    symbol: string,
    issuer: string,
    position: 'from' | 'to',
  ) => void
  side: 'from' | 'to'
  icon?: string
  trustLevel?: 0 | 1 | 2 | 3
  metrics?: {
    holders: string
    trustlines: string
    marketcap: string
  }
  description?: string
}

export default function SwapTokenListItem({
  symbol,
  issuer,
  onTokenSelect,
  side,
  icon,
  trustLevel = 0,
  metrics,
  description,
}: SwapTokenListItemProps) {
  const getTrustLevelColor = (level: number) => {
    switch (level) {
      case 3:
        return 'success.main'
      case 2:
        return 'info.main'
      case 1:
        return 'warning.main'
      default:
        return 'text.disabled'
    }
  }

  return (
    <Box
      onClick={() => onTokenSelect(symbol, issuer, side)}
      sx={{
        px: 2,
        py: 1.5,
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
            src={icon || '/images/default-token.png'}
            alt={symbol}
            sx={{ width: 32, height: 32 }}
          />
          <Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.2 }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {symbol}
              </Typography>
              {trustLevel > 0 && (
                <Tooltip title={`信頼レベル: ${trustLevel}`} arrow>
                  <VerifiedIcon
                    sx={{
                      fontSize: 16,
                      color: getTrustLevelColor(trustLevel),
                    }}
                  />
                </Tooltip>
              )}
              {description && (
                <Tooltip title={description} arrow>
                  <InfoOutlinedIcon
                    sx={{ fontSize: 14, color: 'text.secondary' }}
                  />
                </Tooltip>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {abbreviateString(issuer)}
            </Typography>
          </Box>
        </Box>

        {/* 右側：メトリクス */}
        {metrics && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="ホルダー数" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PeopleOutlineIcon
                  sx={{ fontSize: 14, color: 'text.secondary' }}
                />
                <Typography variant="caption" color="text.secondary">
                  {metrics.holders}
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="トラストライン数" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccountBalanceWalletOutlinedIcon
                  sx={{ fontSize: 14, color: 'text.secondary' }}
                />
                <Typography variant="caption" color="text.secondary">
                  {metrics.trustlines}
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="時価総額" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ShowChartIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  ${metrics.marketcap}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  )
}
