'use client'

import { createTheme, ThemeProvider } from '@mui/material/styles'

interface Props {
  children: React.ReactNode
}

export default function MuiProvider(props: Props) {
  const { children } = props

  const theme = createTheme({
    typography: {
      fontFamily: '"Noto Sans", sans-serif',
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      allVariants: {
        fontWeight: 400,
      },
    },
  })

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
