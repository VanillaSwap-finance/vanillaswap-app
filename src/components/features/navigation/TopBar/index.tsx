'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Box, Button, Toolbar, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import WalletConnectDialog from '@/components/features/navigation/TopBar/WalletConnectDialog'

const AppBar = dynamic(
  () => import('@mui/material').then((mod) => mod.AppBar),
  {
    ssr: false,
  },
)

export default function TopBar() {
  const [openWalletConnectDialog, setOpenWalletConnectDialog] = useState(false)

  return (
    <AppBar position="fixed" color="inherit" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            cursor: 'pointer',
          }}
        >
          VanillaSwap
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', gap: 10 } }}>
          <Button variant="text" color="inherit">
            Swap
          </Button>
          <Button variant="text" color="inherit">
            Pool
          </Button>
          <Button variant="text" color="inherit">
            Staking
          </Button>
          <Button variant="text" color="inherit">
            Bridge
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            disabled
            color="inherit"
            endIcon={<ExpandMoreIcon />}
          >
            XRPL
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setOpenWalletConnectDialog(true)}
          >
            Connect
          </Button>
        </Box>
      </Toolbar>
      <WalletConnectDialog
        open={openWalletConnectDialog}
        onClose={() => setOpenWalletConnectDialog(false)}
      />
    </AppBar>
  )
}
