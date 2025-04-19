'use client'

import { TextField } from '@mui/material'

export default function SwapAmountInput() {
  return (
    <TextField
      variant="outlined"
      type="number"
      placeholder="0"
      slotProps={{
        htmlInput: {
          min: 0,
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& input': {
            textAlign: 'right',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& input[type=number]::-webkit-outer-spin-button': {
            display: 'none',
          },
          '& input[type=number]::-webkit-inner-spin-button': {
            display: 'none',
          },
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
        },
      }}
    />
  )
}
