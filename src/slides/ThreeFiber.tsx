import { Fragment, ReactElement, useEffect } from 'react'
import { COLORS } from '../assets/colors'
import { bounceOut } from '../lib/ease'
import { makeLerp } from '../lib/lerp'
import { AnimTimelineProps, useAnimTimeline } from '../lib/use-anim-timeline'
import { useBackground } from './Background'
import { SubTitle } from './components/SubTitle'
import { useScript } from './Script'


interface Props {
  active:      number
  background?: string
  script?:     string | string[]
}

interface State {
  fiberBox:   number
  htmlBox:    number
  label:      number
  reactBox:   number
  threejsBox: number
  webglBox:   number
}

const ANIM: AnimTimelineProps<State> = {
  init: {
    fiberBox:   8,
    htmlBox:    6,
    label:      0,
    reactBox:   7,
    threejsBox: 7,
    webglBox:   6,
  },
  config: [
    { ease: bounceOut, key: 'htmlBox',    time: [0, 1],   value: makeLerp(6, 0) },
    { ease: bounceOut, key: 'webglBox',   time: [2, 3],   value: makeLerp(6, 0) },
    { ease: bounceOut, key: 'reactBox',   time: [5, 6],   value: makeLerp(7, 1) },
    { ease: bounceOut, key: 'threejsBox', time: [9, 10],  value: makeLerp(7, 1) },
    { ease: bounceOut, key: 'fiberBox',   time: [12, 13], value: makeLerp(8, 2) },
  ],
}

export function ThreeFiber(props: Props): ReactElement {
  const { active, background, script } = props

  useBackground(background)
  useScript(script)

  const { value, play } = useAnimTimeline<State>(ANIM)
  const { webglBox, threejsBox, reactBox, fiberBox, htmlBox } = value

  useEffect(() => {
    play?.()
  }, [play])

  return (
    <Fragment>
      <group position={[0.5, -0.5, 0]} rotation={[0.2, 0.2, 0]} scale={1.2}>
        <Box
          color={COLORS.RAINBOW[11]}
          opacity={active}
          position={[1.7, webglBox, 0]}
          rotation={[0, 0.1, 0]}
          size={[3, 1, 1.2]}
          text="WebGL"
        />
        <Box
          color={COLORS.RAINBOW[7]}
          opacity={active}
          position={[-1.7, htmlBox, -0.1]}
          rotation={[0, 0.1, 0]}
          size={[3, 1, 1.2]}
          text="HTML"
        />
        <Box
          color={COLORS.RAINBOW[0]}
          opacity={active}
          position={[-1.7, reactBox, +0.1]}
          rotation={[0, -0.1, 0]}
          size={[3, 1, 1.2]}
          text="React"
        />
        <Box
          color={COLORS.RAINBOW[1]}
          opacity={active}
          position={[+1.6, threejsBox, 0]}
          rotation={[0, -0.1, 0]}
          size={[3, 1, 1]}
          text="ThreeJS"
        />
        <Box
          color={COLORS.RAINBOW[10]}
          opacity={active}
          position={[+0, fiberBox, 0]}
          rotation={[0, +0.00, 0]}
          size={[5, 1, 0.5]}
          text="@react-three/fiber"
        />
      </group>
    </Fragment>
  )

}

interface BoxProps {
  position:  [number, number, number]
  rotation?: [number, number, number]
  size:      [number, number, number]
  color:     string
  text:      string
  opacity:   number
}

function Box(props: BoxProps): ReactElement {
  const { position, rotation = [0, 0, 0], color, size, opacity, text } = props
  const [x, y, z] = position

  return (
    <group rotation={rotation}>
      <mesh position={position}>
        <boxGeometry args={size} />
        <meshPhysicalMaterial
          clearcoatRoughness={0}
          color={color}
          opacity={opacity}
          roughness={0}
          transparent
        />
      </mesh>
      <SubTitle
        opacity={opacity}
        position={[x, y, z + size[2]/2 + 0.01]}
        text={text}
        textAlign="center"
      />
    </group>
  )
}
