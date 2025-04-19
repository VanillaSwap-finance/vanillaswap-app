'use client'

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import SwapTokenListItem from '@/components/features/swap/TokenSearchDialog/SwapTokenListItem'

interface TokenSearchDialogProps {
  open: boolean
  onClose: () => void
  onTokenSelect: (
    symbol: string,
    issuer: string,
    position: 'from' | 'to',
  ) => void
  side: 'from' | 'to'
}

export default function TokenSearchDialog({
  open,
  onClose,
  onTokenSelect,
  side,
}: TokenSearchDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Search for a token</DialogTitle>
      <DialogContent sx={{ px: 0, height: '500px', position: 'relative' }}>
        <Box
          sx={{
            px: 2,
            pb: 3,
            position: 'sticky',
            top: 0,
            backgroundColor: 'background.paper',
            zIndex: 2,
          }}
        >
          <TextField
            label="Search"
            placeholder="Search by name"
            sx={{
              mt: 1,
            }}
            fullWidth
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            flex: 1,
            position: 'relative',
            zIndex: 1,
            mt: 1,
          }}
        >
          <SwapTokenListItem
            symbol="XRP"
            issuer="XRP"
            onTokenSelect={onTokenSelect}
            side={side}
          />
          <SwapTokenListItem
            symbol="Mimimi"
            issuer="rMTnMGHk7k7brMC3vUNn7uP9t7WtLEdZUw"
            onTokenSelect={onTokenSelect}
            side={side}
          />
        </Box>
      </DialogContent>
    </Dialog>
  )
}
