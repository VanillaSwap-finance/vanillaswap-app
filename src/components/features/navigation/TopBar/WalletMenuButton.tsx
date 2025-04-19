'use client'

import { useState } from 'react'
import {
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import type { Wallet } from '@/types/wallet'

interface WalletMenuButtonProps {
  wallet: Wallet
  disconnect: () => void
}

export default function WalletMenuButton({
  wallet,
  disconnect,
}: WalletMenuButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        size="small"
        aria-controls={open ? 'wallet-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{ color: 'inherit' }}
        onClick={handleClick}
      >
        <AccountBalanceWalletIcon />
      </IconButton>
      <Menu
        id="wallet-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography component="div" variant="overline">
            Address
          </Typography>
          <Typography component="div" variant="body2">
            {wallet.address}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={disconnect}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <ExitToAppIcon />
          </ListItemIcon>
          Disconnect
        </MenuItem>
      </Menu>
    </>
  )
}
