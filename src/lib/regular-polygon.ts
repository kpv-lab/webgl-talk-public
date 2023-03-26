import { useMemo } from 'react'

interface Props {
  angularOffset?: number
  center:         [number, number, number]
  radius:         number
  sides:          number
}

export function useRegularPolygon(props: Props): [number, number, number][] {
  const { angularOffset, center, radius, sides } = props
  return useMemo(() => makeRegularPolygon(props), [...center, angularOffset, radius, sides])
}

export function makeRegularPolygon(props: Props): [number, number, number][] {
  const { angularOffset = 0, center, radius, sides } = props
  const z = center[2]

  const angle = 2 * Math.PI / sides
  return Array.from({ length: sides }, (_, i) => {
    const theta = angle * i + angularOffset
    return [Math.cos(theta) * radius, Math.sin(theta) * radius, z]
  })
}

interface DirectionProps {
  angularOffset?: number
  sides:          number
  vertex:         number
}

export function getDirection(props: DirectionProps): [number, number] {
  const { angularOffset, vertex, sides } = props
  const angle = 2 * Math.PI / sides
  const theta = angle * vertex
  return [Math.cos(theta), Math.sin(theta)]
}
