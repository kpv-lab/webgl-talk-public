import { ReactElement } from 'react'

interface Props {
  position?:   [number, number, number]
  opacity?:     number
  color?:       string
}

export function Plane(props: Props): ReactElement {
  const { color, position= [0,0,-5], opacity } = props

  return (
    <mesh scale={1} position={position} receiveShadow>
      <planeGeometry args={[100,100]} />
      <meshPhysicalMaterial color={color} transparent opacity={opacity} />
    </mesh>
  )
}
