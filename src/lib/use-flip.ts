import { useMemo } from 'react'
import { DEG_15 } from './util'

type NNN = [number, number, number]

interface Props {
  dx: number
  dz?: number
}

interface Flip {
  left:  (p: number) => { position: NNN, rotation: NNN }
  right: (p: number) => { position: NNN, rotation: NNN }
}

export function useFlip(props: Props): Flip {
  const { dx, dz = 0 } = props

  return useMemo(() => {
    return { left, right }

    function left(p: number): { position: NNN, rotation: NNN } {
      const theta = p * Math.PI
      const x = -Math.sin(theta) * dx
      const z = 0.1 * (1 - p) + Math.sin(2 * theta) * dz
      const angle = Math.sin((2 * p - 1) * Math.PI) * DEG_15

      return { position: [x, 0, z], rotation: [0, angle, 0] }
    }

    function right(p: number): { position: NNN, rotation: NNN } {
      const theta = p * Math.PI
      const x = Math.sin(theta) * dx
      const z = 0.1 * p - Math.sin(2 * theta) * dz
      const angle = Math.sin((2 * p - 1) * Math.PI) * DEG_15

      return { position: [x, 0, z], rotation: [0, angle, 0] }
    }
  }, [dx, dz])
}

