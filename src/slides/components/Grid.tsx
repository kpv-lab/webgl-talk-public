import { Point } from 'geometric'
import { ReactElement, useMemo } from 'react'

interface Props {
  color:    (center: Point, debug?: boolean) => string
  count:    [number, number]
  opacity?: number
  origin:   [number, number, number]
  size:     number
}

export function Grid(props: Props): ReactElement {
  const { color, count, origin, size } = props

  const start = useMemo<[number, number, number]>(() => {
    return [origin[0] - count[0] * size / 2, origin[1] - count[1] * size / 2, origin[2]]
  }, [...origin, ...count, size])

  const pairs = useMemo(() => {
    return Array.from({ length: count[0] }, (_, x) => Array.from({ length: count[1] }, (_, y) => [x, y])).flat()
  }, [...count])

  return (
    <group>
      {
        pairs.map(([x, y], i) => {
          const center: Point = [start[0] + x * size, start[1] + y * size]
          return <Cell key={i} {...props} color={color(center)} x={x} y={y} origin={start} />
        })
      }
    </group>
  )
}

interface CellProps extends Omit<Props, 'color'> {
  color:  string
  x:      number
  y:      number
}

function Cell(props: CellProps): ReactElement {
  const { color, opacity = 1, origin, size, x, y } = props

  return (
    <mesh position={[origin[0] + x * size, origin[1] + y * size, origin[2]]}>
      <boxGeometry args={[size - 0.01, size - 0.01, 0.01]}/>
      <meshPhysicalMaterial
        color={color}
        opacity={color ? opacity : 0}
        transparent
      />
    </mesh>
  )
}
