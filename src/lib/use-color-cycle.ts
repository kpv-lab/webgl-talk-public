import chroma from 'chroma-js'
import { useCallback } from 'react'

interface GetColor {
  (position: number): string
}

export function useColorCycle(colors: string[]): GetColor {
  return useCallback((position: number): string => {
    const p = Math.max(0, position + colors.length)
    const start = Math.floor(p) % colors.length
    const end = Math.ceil(p) % colors.length
    return chroma.mix(colors[start], colors[end], p % 1).hex()
  }, [colors])
}
