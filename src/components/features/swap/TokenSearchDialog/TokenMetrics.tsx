'use client'

import { Box, Typography, Tooltip } from '@mui/material'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'

interface TokenMetricsProps {
  holders: string
  price: string
}

export default function TokenMetrics({ holders, price }: TokenMetricsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Tooltip title="Holders" arrow>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PeopleOutlineIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {holders}
          </Typography>
        </Box>
      </Tooltip>
      <Tooltip title="Price" arrow>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            $ {price}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  )
}
