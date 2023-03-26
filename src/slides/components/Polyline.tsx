import { ReactElement, useEffect, useMemo, useState } from 'react'
import { CylinderGeometry, Mesh, Vector3 } from 'three'
import { DEG_90 } from '../../lib/util'

interface Props {
  color:        string
  opacity?:     number
  radius:       number
  vertices:     [number, number, number][]
  partial?:     number
}

export function Polyline(props: Props): ReactElement {
  const { vertices, partial = 1 } = props

  const partials = useMemo(() => {
    const { length } = vertices
    const p = length * partial
    return Array.from({ length }, (_, i) => i + 1 < p ? 1 : Math.max(0, p - i))
  }, [vertices.length, partial])

  return (
    <group>
      { Array.from({ length: vertices.length }, (_, i) => (
        <Edge key={i} {...props} start={vertices[i]} end={vertices[(i + 1) % vertices.length]} partial={partials[i]} />
      ))}
    </group>
  )
}

interface EdgeProps {
  color:        string
  end:          [number, number, number]
  opacity?:     number
  radius:       number
  start:        [number, number, number]
  partial?:     number
}

function Edge(props: EdgeProps): ReactElement | null {
  const { color, end, opacity = 1, partial = 1, radius, start } = props

  const [mesh, setMesh] = useState<Mesh | null>(null)
  const [geo, setGeo] = useState<CylinderGeometry | null>(null)

  const vector = useMemo(() => new Vector3(...end).sub(new Vector3(...start)), [...end, ...start])
  const length = useMemo(() => vector.length() * partial, [vector, partial])

  useEffect(() => {
    mesh?.lookAt(new Vector3(...end))
  }, [mesh, end])

  useEffect(() => {
    geo?.translate(0, length / 2, 0)
    geo?.rotateX(DEG_90)

    return function unmount(): void {
      geo?.rotateX(-DEG_90)
      geo?.translate(0, -length / 2, 0)
    }
  }, [geo, length])

  return length
    ? (
      <mesh ref={setMesh} position={start} castShadow>
        <cylinderGeometry ref={setGeo} args={[radius, radius, length, 16]}/>
        <meshPhysicalMaterial color={color} opacity={opacity} transparent />
      </mesh>
    )
    : null
}
