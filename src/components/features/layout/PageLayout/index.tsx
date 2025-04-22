'use client'

import dynamic from 'next/dynamic'
import { SnackbarProvider, closeSnackbar } from 'notistack'

const Container = dynamic(
  () => import('@mui/material').then((mod) => mod.Container),
  {
    ssr: false,
  },
)

interface PageLayoutProps {
  children: React.ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      action={(snackbarId) => (
        <button
          style={{
            backgroundColor: 'transparent',
            border: '0.5px solid white',
            borderRadius: '2px',
            cursor: 'pointer',
            color: 'white',
          }}
          onClick={() => closeSnackbar(snackbarId)}
        >
          Close
        </button>
      )}
    >
      {children}
    </SnackbarProvider>
  )
}
