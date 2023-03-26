import { useFrame } from '@react-three/fiber'
import { Fragment, ReactElement, useRef, useState } from 'react'
import { COLORS } from '../assets/colors'
import { clamp } from '../lib/math'
import { useColorCycle } from '../lib/use-color-cycle'
import { useBackground } from './Background'
import { Code } from './components/Code'
import { useScript } from './Script'

import text from '/src/assets/platonic-example.txt?raw'


interface Props {
  active:      number
  background?: string
  script?:     string | string[]
}

export function PlatonicExample(props: Props): ReactElement {
  const { active, background, script } = props

  useBackground(background)
  useScript(script)

  const [show, setShow] = useState(false)
  const [opacity, setOpacity] = useState(0)
  const acceleration = useRef(0)
  const [rotation, setRotation] = useState(0)
  const [color, setColor] = useState(0)

  const getColor = useColorCycle(COLORS.RAINBOW)

  useFrame((_, delta) => {
    if (show) {
      setOpacity(opacity => clamp(opacity + delta * 0.3, 0, 0.75))
      acceleration.current = clamp(acceleration.current + 0.02, 0, 0.4)
    }
    setRotation(rotation => rotation + delta * acceleration.current)
    setColor(color => color + delta * 0.3)
  })

  return (
    <Fragment>
      <Code
        onComplete={() => setShow(true)}
        opacity={active}
        position={[0, 0, 2]}
        scale={0.6}
        text={text}
        transparent
      />
      <mesh position={[0, 0, -1]} rotation={[Math.PI / 16, rotation, 0]}>
        <dodecahedronGeometry args={[3, 0]} />
        <meshPhysicalMaterial
          clearcoat={1}
          color={getColor(color)}
          opacity={clamp(opacity * active, 0, 1)}
          roughness={0}
          sheen={0.5}
          transparent
        />
      </mesh>
    </Fragment>
  )
}
