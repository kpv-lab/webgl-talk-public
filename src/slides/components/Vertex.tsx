import { ReactElement } from 'react'
import { DEG_90 } from '../../lib/util'

interface Props {
  color:        string
  opacity:      number
  position?:    [number, number, number]
  radius:       number
  transparant?: boolean
}

export function Vertex(props: Props): ReactElement {
  const { color, position, radius } = props

  return (
    <mesh position={position} rotation={[DEG_90, 0, 0]} castShadow>
      <cylinderGeometry args={[radius, radius, 0.05]}/>
      <meshPhysicalMaterial
        color={color}
        clearcoat={1}
        clearcoatRoughness={0}
        reflectivity={0.5}
        roughness={0}
      />
    </mesh>
  )
}
