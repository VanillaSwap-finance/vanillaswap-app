'use client'

import { Box, Avatar, Typography, Tooltip } from '@mui/material'
import { abbreviateString } from '@/utils/string'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

interface TokenBasicInfoProps {
  symbol: string
  name: string
  icon?: string
  issuer: string
  description?: string
}

export default function TokenBasicInfo({
  symbol,
  name,
  icon,
  issuer,
  description,
}: TokenBasicInfoProps) {
  return (
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
  )
}
