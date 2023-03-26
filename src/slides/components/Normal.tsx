import { ReactElement, useEffect, useMemo, useState } from 'react'
import { CylinderGeometry, Euler, Quaternion, Vector3 } from 'three'
import { DEG_90 } from '../../lib/util'

interface Props {
  color:        string
  opacity?:     number
  position?:    [number, number, number]
  normal:       [number, number, number]
}

const TOWARDS = new Vector3(0, 0, 1)

export function Normal(props: Props): ReactElement {
  const { color, position, normal, opacity = 1 } = props

  const rotation = useMemo(() => {
    const q = new Quaternion().setFromUnitVectors(TOWARDS, new Vector3(...normal))
    return new Euler().setFromQuaternion(q)
  }, [normal])

  const [head, setHead] = useState<CylinderGeometry | null>(null)
  const [stem, setStem] = useState<CylinderGeometry | null>(null)

  useEffect(() => {
    stem?.translate(0, 0.5, 0)
    stem?.rotateX(DEG_90)
    head?.translate(0, 1, 0)
    head?.rotateX(DEG_90)

    return function unmount(): void {
      stem?.rotateX(-DEG_90)
      stem?.translate(0, -0.5, 0)
      head?.rotateX(-DEG_90)
      head?.translate(0, -1, 0)
    }
  }, [head])

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow={opacity > 0.2}>
        <cylinderGeometry ref={setStem} args={[0.02, 0.02, 1]} />
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0}
          color={color}
          opacity={opacity}
          reflectivity={0.5}
          roughness={0}
          transparent
        />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow={opacity > 0.2}>
        <cylinderGeometry ref={setHead} args={[0, 0.05, 0.1]} />
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0}
          color={color}
          opacity={opacity}
          reflectivity={0.5}
          roughness={0}
          transparent
        />
      </mesh>
    </group>
  )
}
