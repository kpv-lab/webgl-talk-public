import { useFrame } from '@react-three/fiber'
import { Fragment, ReactElement, useRef, useState } from 'react'
import { Group } from 'three'
import { useBackground } from './Background'
import { ClownFish } from './components/ClownFish'
import { NerfedClownFish } from './components/NerfedClownFish'
import { SubTitle } from './components/SubTitle'
import { useScript } from './Script'


interface Props {
  active:      number
  background?: string
  script?:     string | string[]
}

export function FishProblems(props: Props): ReactElement {
  const { active, background, script } = props

  useBackground(background)
  useScript(script)

  const [fishA, setFishA] = useState<Group | null>(null)
  const [fishB, setFishB] = useState<Group | null>(null)

  const angleA = useRef(0)
  const angleB = useRef(0.5)

  useFrame(({ camera }, dt) => {
    const workingRadius = active * 0.5

    angleA.current += 0.1 * dt
    angleB.current += 0.24 * dt
    if (fishA && fishB) {
      fishA.position.x = 1.2 * Math.cos(angleA.current) * workingRadius
      fishA.position.y = 1.2 * Math.sin(angleA.current) * workingRadius
      fishB.position.x = Math.cos(angleB.current) * workingRadius
      fishB.position.y = Math.sin(angleB.current) * workingRadius
    }
  })

  return (
    <Fragment>
      <SubTitle position={[0, 2.5, 0]} text="But third-party assets create pipeline issues" />
      <group ref={setFishA}>
        <NerfedClownFish
          opacity={active}
          position={[-2, 0, 1]}
          scale={0.6}
          transparent
          castShadow
        />
      </group>
      <group ref={setFishB}>
        <ClownFish
          opacity={active}
          scale={0.6}
          position={[2, 0, 1]}
          transparent
          castShadow
        />
      </group>
      <SubTitle
        position={[0, -2.5, 0]}
        scale={0.7}
        text="(Thanks to Denys Almaral for his fish, and his patience!)"
        textAlign="right"
      />
    </Fragment>
  )
}
