'use client'

import { Button } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface TokenSelectButtonProps {
  token: string
  onClose: () => void
}

export default function TokenSelectButton({
  token,
  onClose,
}: TokenSelectButtonProps) {
  return (
    <Button
      variant="text"
      color="inherit"
      endIcon={<ExpandMoreIcon />}
      disableElevation
      onClick={onClose}
    >
      {token}
    </Button>
  )
}
