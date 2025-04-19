'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  Box,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { enqueueSnackbar } from 'notistack'
import { useWallet, type WalletType } from '@/hooks/useWallet'
import { WALLETS } from '@/constants/wallet'

interface WalletConnectDialogProps {
  open: boolean
  onClose: () => void
}

export default function WalletConnectDialog({
  open,
  onClose,
}: WalletConnectDialogProps) {
  const { isConnected, connect } = useWallet()

  const handleConnect = async (wallet: (typeof WALLETS)[number]) => {
    try {
      if (wallet.disabled) return
      await connect(wallet.label as WalletType)
    } catch (error: any) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      })
    } finally {
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Connect a wallet</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ pt: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {WALLETS.map((wallet) => {
            return (
              <Button
                key={wallet.label}
                variant="outlined"
                color="inherit"
                fullWidth
                disabled={wallet.disabled}
                onClick={() => handleConnect(wallet)}
              >
                {wallet.label}
              </Button>
            )
          })}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
