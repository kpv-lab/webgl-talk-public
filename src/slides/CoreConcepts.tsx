import { useFrame } from '@react-three/fiber'
import { Fragment, ReactElement, useState } from 'react'
import { COLORS } from '../assets/colors'
import { useColorCycle } from '../lib/use-color-cycle'
import { useBackground } from './Background'
import { SubTitle } from './components/SubTitle'
import { useScript } from './Script'


interface Props {
  active:      number
  background?: string
  script?:     string | string[]
}

export function CoreConcepts(props: Props): ReactElement {
  const { active, background, script } = props

  useBackground(background)
  useScript(script)

  const [rotation, setRotation] = useState(0)
  const [color, setColor] = useState(0)
  const getColor = useColorCycle(COLORS.RAINBOW)

  useFrame((_, delta) => {
    setRotation(rotation => rotation + delta * 0.2)
    setColor(color => color + delta * 1)
  })

  return (
    <Fragment>
      <spotLight position={[-5, 5, 0]} />
      <spotLight position={[5, 5, 0]} />
      <spotLight position={[0, 0, 0]} />
      <group position={[-3, 1.5, 0]}>
        <SubTitle position={[0.5, -1, 1]} scale={0.5} text="<geometry>" opacity={active} />
        <mesh rotation={[Math.PI / 16, rotation, 0]}>
          <octahedronGeometry args={[1]} />
          <meshBasicMaterial
            color={'white'}
            opacity={active}
            transparent
            wireframe
          />
        </mesh>
      </group>
      <group position={[3, 1.5, 0]}>
        <SubTitle position={[-0.5, -1, 1]} scale={0.5} text="<material>" opacity={active} />
        <mesh rotation={[Math.PI / 16, rotation, 0]}>
          <sphereGeometry args={[0.5]} />
          <meshPhysicalMaterial
            clearcoat={1}
            color={getColor(color)}
            opacity={active}
            roughness={0}
            metalness={0.4}
            sheen={0.5}
            transparent
          />
        </mesh>
      </group>
      <group position={[0, -0.5, 2]}>
        <SubTitle position={[0, -0.5, 1]} scale={0.5} text="<mesh>" opacity={active} />
        <mesh rotation={[Math.PI / 16, rotation, 0]}>
          <octahedronGeometry args={[1]} />
          <meshPhysicalMaterial
            clearcoat={1}
            color={getColor(color)}
            opacity={active}
            roughness={0}
            metalness={0.4}
            sheen={0.5}
            transparent
          />
        </mesh>
      </group>
    </Fragment>
  )
}
