import { useFrame } from '@react-three/fiber'
import chroma from 'chroma-js'
import { Fragment, ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { BufferAttribute, BufferGeometry, DoubleSide, IcosahedronGeometry, Vector3 } from 'three'
import { COLORS } from '../assets/colors'
import { quadIn, quadOut } from '../lib/ease'
import { makeLerp } from '../lib/lerp'
import { sleep } from '../lib/sleep'
import { AnimTimelineProps, useAnimTimeline } from '../lib/use-anim-timeline'
import { useBackground } from './Background'
import { SubTitle } from './components/SubTitle'
import { useScript } from './Script'


interface Props {
  active:      number
  background?: string
  script?:     string | string[]
}

const FACES = 20
const SUBDIVISIONS = 0
const VERTICES_PER_FACE = 3

interface State {
  deltaR:  number
  deltaS:  number
  opacity: number
}

const ANIM: AnimTimelineProps<State> = {
  init: { deltaR: 0, deltaS: 0, opacity: 1 },
  config: [
    { ease: quadIn,  key: 'deltaR',  time: [0, 6],   value: makeLerp(0, 1) },
    { ease: quadIn,  key: 'opacity', time: [9, 12],  value: makeLerp(1, 0.7), },
    { ease: quadIn,  key: 'deltaS',  time: [15, 18], value: makeLerp(0, 1), },
    { ease: quadOut, key: 'deltaS',  time: [21, 24], value: makeLerp(1, 0), },
    { ease: quadOut, key: 'opacity', time: [24, 27], value: makeLerp(0.7, 1), },
    { ease: quadOut, key: 'deltaR',  time: [27, 30], value: makeLerp(1, 0), },
  ],
}

export function ControlExample(props: Props): ReactElement {
  const { active, background, script } = props

  useBackground(background)
  useScript(script)

  const { value, play, reset } = useAnimTimeline(ANIM)
  const { deltaR, deltaS, opacity } = value

  useEffect(() => {
    let isMounted = true
    sequence()

    return function unmount() {
      isMounted = false
    }

    async function sequence(): Promise<void> {
      await play()
      await sleep(1)
      reset()
      isMounted && sequence()
    }
  }, [])

  const geometry = useMemo(() => {
    const colors = makeColors()
    const geometry = new IcosahedronGeometry(1, SUBDIVISIONS)
    geometry.setAttribute('color', new BufferAttribute(colors, 3))
    return geometry
  }, [])

  useHeights(geometry, deltaS)
  const [rotation, setRotation] = useState<[number, number, number]>([Math.PI / 16, 0, 0])

  useFrame((_, delta) => {
    const d = deltaR * delta
    setRotation(([x, y, z]) => [x, y + 1.0 * d, z + 0.6 * d])
  })

  return (
    <Fragment>
      <SubTitle position={[0, 2.5, 0]} text="Every aspect of a model can be controlled" />
      <mesh
        castShadow
        frustumCulled={false}
        geometry={geometry}
        position={[0, -0.5, 0]}
        rotation={rotation}
        scale={2}
      >
        <meshPhysicalMaterial
          clearcoat={1}
          metalness={0.8}
          opacity={opacity * active}
          roughness={0}
          sheen={0.5}
          side={DoubleSide}
          transparent
          vertexColors
        />
      </mesh>
    </Fragment>
  )
}

function makeColors(): Float32Array {
  const { RAINBOW } = COLORS

  const data = new Float32Array(FACES * VERTICES_PER_FACE * 3)
  for (let i = 0; i < FACES; i++) {
    const [r, g, b] = chroma.hex(RAINBOW[i % RAINBOW.length]).gl()
    for (let j = 0; j < VERTICES_PER_FACE; j++) {
      data.set([r, g, b], (i * VERTICES_PER_FACE + j) * 3)
    }
  }
  return data
}

function useHeights(geometry: BufferGeometry, deltaS: number): void {
  const position = geometry.getAttribute('position') as BufferAttribute

  const deltas = useMemo(() => Array.from({ length: FACES }, (_, i) => 1 * (Math.random() - 0.5)), [])
  const rotations = useRef<number[]>(Array.from({ length: FACES }, (_, i) => 0))

  const vectors = useMemo(() => {
    return Array.from({ length: VERTICES_PER_FACE * FACES }).map(getBase)

    function getBase(_: unknown, i: number): Vector3 {
      return new Vector3(position.getX(i), position.getY(i), position.getZ(i))
    }
  }, [position])

  useFrame((_, delta) => {
    rotations.current = rotations.current.map((rotation, i) => rotation + delta * deltas[i])
    const heights = rotations.current.map(rotation => 1 + deltaS * Math.sin(rotation))

    for (let i = 0; i < vectors.length; i++) {
      const height = heights[Math.floor(i / VERTICES_PER_FACE)]
      const vertex = vectors[i].clone().multiplyScalar(height)
      position.set(vertex.toArray(), i * 3)
    }
    position.needsUpdate = true
  })
}
