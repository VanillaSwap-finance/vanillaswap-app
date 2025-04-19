'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Box, Button, Toolbar, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import WalletConnectDialog from '@/components/features/navigation/TopBar/WalletConnectDialog'
import { useWallet } from '@/hooks/useWallet'
import WalletMenuButton from '@/components/features/navigation/TopBar/WalletMenuButton'

const AppBar = dynamic(
  () => import('@mui/material').then((mod) => mod.AppBar),
  {
    ssr: false,
  },
)

export default function TopBar() {
  const router = useRouter()

  const [openWalletConnectDialog, setOpenWalletConnectDialog] = useState(false)

  const { wallet, isConnected, disconnect } = useWallet()

  return (
    <AppBar position="fixed" color="inherit" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          onClick={() => router.push('/')}
          sx={{
            flexGrow: 1,
            cursor: 'pointer',
          }}
        >
          VanillaSwap
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', gap: 10 } }}>
          <Button
            variant="text"
            color="inherit"
            onClick={() => router.push('/swap')}
          >
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
          {!isConnected && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setOpenWalletConnectDialog(true)}
            >
              Connect
            </Button>
          )}
          {isConnected && wallet && (
            <WalletMenuButton wallet={wallet} disconnect={disconnect} />
          )}
        </Box>
      </Toolbar>
      <WalletConnectDialog
        open={openWalletConnectDialog}
        onClose={() => setOpenWalletConnectDialog(false)}
      />
    </AppBar>
  )
}
