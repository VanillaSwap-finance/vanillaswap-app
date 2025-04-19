import { Container } from '@mui/material'
import HomeContent from '@/app/home-content'

export default function Home() {
  return (
    <Container maxWidth="sm" sx={{ pt: 8 }}>
      <HomeContent />
    </Container>
  )
}
