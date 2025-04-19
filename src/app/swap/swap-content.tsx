'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TokenSearchDialog from '@/components/features/token/TokenSearchDialog'

export default function SwapContent() {
  const [open, setOpen] = useState(false)

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
          <Typography variant="body2" sx={{ mb: 1 }}>
            From
          </Typography>
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
            <Button
              variant="text"
              color="inherit"
              endIcon={<ExpandMoreIcon />}
              disableElevation
              onClick={() => setOpen(true)}
            >
              XRP
            </Button>
            <TextField variant="outlined" size="small" />
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
            >
              <SwapVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            To
          </Typography>
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
            <Button
              variant="text"
              color="inherit"
              endIcon={<ExpandMoreIcon />}
              disableElevation
              onClick={() => setOpen(true)}
            >
              MIMIMI
            </Button>
            <TextField variant="outlined" size="small" />
          </Box>
        </Box>
      </CustomBox>
      <CustomBox>
        <Button variant="contained" fullWidth disableElevation>
          Swap
        </Button>
      </CustomBox>

      <TokenSearchDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  )
}
