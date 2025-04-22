import { Container } from '@mui/material'
import SwapContent from '@/app/swap/swap-content'
import { Suspense } from 'react'

export default function Swap() {
  return (
    <Container maxWidth="xs" sx={{ pt: 8 }}>
      <Suspense fallback={<div>Loading...</div>}>
        <SwapContent />
      </Suspense>
    </Container>
  )
}
