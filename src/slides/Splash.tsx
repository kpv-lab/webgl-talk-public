import { useFrame } from '@react-three/fiber'
import { ReactElement, useState } from 'react'
import { COLORS } from '../assets/colors'
import { useBackground } from './Background'
import { SubTitle } from './components/SubTitle'
import { useScript } from './Script'
import { useGentleRotation } from './use-gentle-rotation'

interface Props {
  active:      number
  background?: string
  script?:     string
}

export function Splash(props: Props): ReactElement {
  const { active, background, script } = props

  useGentleRotation(0.5, active)
  useBackground(background)
  useScript(script)

  const [rotation, setRotation] = useState<[number, number, number]>([Math.PI / 16, 0, 0])

  useFrame((_, delta) => {
    setRotation([rotation[0], rotation[1] + delta, rotation[2] + delta * 0.05])
  })

  return (
    <group>
      <group scale={0.5}>
        <mesh position={[-4.5, 0, 0]} rotation={rotation} castShadow>
          <tetrahedronGeometry args={[1]} />
          <SplashMaterial active={active} />
        </mesh>
        <mesh position={[-2.25, 0, 0]} rotation={rotation} castShadow>
          <boxGeometry args={[1, 1]} />
          <SplashMaterial active={active} />
        </mesh>
        <mesh position={[0, 0, 0]} scale={0.8} rotation={rotation} castShadow>
          <octahedronGeometry args={[1]} />
          <SplashMaterial active={active} />
        </mesh>
        <mesh position={[2.25, 0, 0]} scale={0.7} rotation={rotation} castShadow>
          <dodecahedronGeometry args={[1]} />
          <SplashMaterial active={active} />
        </mesh>
        <mesh position={[4.5, 0, 0]} scale={0.8} rotation={rotation} castShadow>
          <icosahedronGeometry args={[1]} />
          <SplashMaterial active={active} />
        </mesh>
      </group>
      <SubTitle
        position={[0, -1, 0]}
        scale={0.5}
        text="github.com/kpv-lab/webgl-talk-public"
        link="https://github.com/kpv-lab/webgl-talk-public"
      />
      <SubTitle
        position={[0, -1.3, 0]}
        scale={0.5}
        text="watch talk @ youtube"
        link="https://www.youtube.com/live/T9bQ0wLe63U?feature=share&t=180"
      />
    </group>
  )
}

interface MaterialProps {
  active: number
}

function SplashMaterial(props: MaterialProps): ReactElement {
  const { active } = props

  return (
    <meshPhysicalMaterial
      color={COLORS.MAIN.WHITE}
      opacity={active}
      metalness={0.4}
      sheen={1}
      clearcoat={1}
      transparent
    />
  )
}
