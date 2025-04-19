export const useSwap = () => {
  const handleSwap = () => {
    try {
      console.log('handleSwap')
    } catch (error) {
      console.error(error)
      throw new Error('Failed to swap')
    }
  }

  return {
    handleSwap,
  }
}
