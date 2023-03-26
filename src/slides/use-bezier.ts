import { useMemo } from 'react'

interface XYZ {
  x: number
  y: number
  z: number
}

export function useBezier(a: XYZ, b: XYZ, c: XYZ, d: XYZ): (p: number) => XYZ {
  return useMemo(() => makeBezier(a, b, c, d), [a, b, c, d])
}

const BEZIER = [
  [+1, +0, +0, +0],
  [-3, +3, +0, +0],
  [+3, -6, +3, +0],
  [-1, +3, -3, +1],
]

export function makeBezier(a: XYZ, b: XYZ, c: XYZ, d: XYZ): (p: number) => XYZ {
  const x = [a.x, b.x, c.x, d.x]
  const y = [a.y, b.y, c.y, d.y]
  const z = [a.z, b.z, c.z, d.z]

  const xParts = BEZIER.map(row => row.reduce((acc, value, i) => acc + value * x[i], 0))
  const yParts = BEZIER.map(row => row.reduce((acc, value, i) => acc + value * y[i], 0))
  const zParts = BEZIER.map(row => row.reduce((acc, value, i) => acc + value * z[i], 0))

  return function bezier(p: number): XYZ {
    const t = [1, p, p * p, p * p * p]
    const x = t.reduce((acc, value, i) => acc + xParts[i] * value, 0)
    const y = t.reduce((acc, value, i) => acc + yParts[i] * value, 0)
    const z = t.reduce((acc, value, i) => acc + zParts[i] * value, 0)
    return { x, y, z }
  }
}
