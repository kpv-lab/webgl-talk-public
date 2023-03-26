import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'


export function useGentleRotation(radius: number, active: number): void {
  const angle = useRef(Math.random() * 2 * Math.PI)

  useFrame(({ camera }, dt) => {
    const workingRadius = active * radius

    angle.current += 0.1 * dt
    camera.position.x = Math.cos(angle.current) * workingRadius
    camera.position.y = Math.sin(angle.current) * workingRadius
  })
}
