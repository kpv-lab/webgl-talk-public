import { Fragment, ReactElement, useEffect } from 'react'
import { COLORS } from '../../assets/colors'
import { FONTS } from '../../assets/fonts'
import { quadInOut, quadOut } from '../../lib/ease'
import { makeLerp, makeNumberArrayLerp } from '../../lib/lerp'
import { AnimTimelineProps, useAnimTimeline } from '../../lib/use-anim-timeline'
import { DEG_90 } from '../../lib/util'
import { useBackground } from '../Background'
import { useScript } from '../Script'
import { SubTitle } from './SubTitle'

interface State {
  angle:  number
  flash:  number[]
  svg:    number[]
  canvas: number[]
  webgl:  number[]
  webgpu: number[]
}

const ANIM: AnimTimelineProps<State> = {
  init: {
    angle:  0,
    flash:  [0, 0],
    svg:    [0, 0],
    canvas: [0, 0],
    webgl:  [0, 0],
    webgpu: [0, 0],
  },
  config: [
    { ease: quadInOut, key: 'angle',  time: [0, 20],  value: makeLerp(-Math.PI / 16, 0.01)  },
    { ease: quadOut,   key: 'flash',  time: [0, 2],   value: makeNumberArrayLerp([0, 0], [0, 13])  },  // 1996 - 2009
    { ease: quadOut,   key: 'canvas', time: [4, 6],   value: makeNumberArrayLerp([8, 8], [8, 27])   }, // 2004 - 2023
    { ease: quadOut,   key: 'svg',    time: [8, 10],  value: makeNumberArrayLerp([9, 9], [9, 27])   }, // 2005 - 2023
    { ease: quadOut,   key: 'webgl',  time: [12, 14], value: makeNumberArrayLerp([13,13], [13,27])  }, // 2009 - 2023
    { ease: quadOut,   key: 'webgpu', time: [16, 18], value: makeNumberArrayLerp([25,25], [25, 27]) }, // 2021 - 2023
  ],
}

interface Props {
  active:      number
  background?: string
  script?: string | string[]
}

export function History(props: Props): ReactElement {
  const { active, background, script } = props

  useBackground(background)
  useScript(script)

  const { value, play } = useAnimTimeline<State>(ANIM)
  const { angle, flash, canvas, svg, webgl, webgpu } = value
  const isPlayable = active === 1

  useEffect(() => {
    isPlayable && play?.()
  }, [isPlayable, play])

  return (
    <Fragment>
      <SubTitle position={[0, 3, 0]} text="Web Graphics Technologies" opacity={active} />
      <group position={[0.5, 0, 0]} rotation={[-Math.PI / 16, angle, angle]} scale={0.9}>
        {
          Array.from({ length: 7 }, (_, i) => (
            <Label
              key={i}
              text={`${1996 + 4 * i}`}
              x={4 * i}
              opacity={active}
            />
          ))
        }
        <Item x={flash} y={2.5} text="Flash" index={1} opacity={active} />
        <Item x={canvas} y={1.5} text="Canvas" index={3} opacity={active} />
        <Item x={svg} y={0.5} text="SVG" index={6} opacity={active} />
        <Item x={webgl} y={-0.5} text="WebGL" index={9} opacity={active} />
        <Item x={webgpu} y={-1.5} text="WebGPU" index={11} opacity={active} />
      </group>
    </Fragment>
  )
}


interface ItemProps {
  index:        number
  opacity?:     number
  text:         string
  x:            number[]
  y:            number
}

const OFFSET = -5
const SCALAR = 0.3
const PADDING = 0.1

function Item(props: ItemProps): ReactElement | null {
  const { text, index, opacity = 1, x, y } = props

  const start = x[0] * SCALAR
  const end = x[1] * SCALAR

  return start !== end
    ? (
      <Fragment>
        <mesh
          position={[OFFSET + (start + end) / 2, y, 0]}
          rotation={[0, 0, DEG_90]}
          scale={[1, end - start, 0.6]}
          castShadow
        >
          <cylinderGeometry args={[0.35, 0.35, 1, 16, 16]} />
          <meshPhysicalMaterial
            color={COLORS.RAINBOW[index]}
            opacity={opacity}
            transparent
            clearcoat={1}
            clearcoatRoughness={0}
            reflectivity={0.5}
            roughness={0}
          />
        </mesh>
        <text
          // eslint-disable-next-line
          // @ts-ignore
          position={[OFFSET + end + PADDING, y, 0]}
          fontSize={0.4}
          color={COLORS.TEXT.MAIN}
          maxWidth={300}
          lineHeight={1}
          letterSpacing={0}
          textAlign="left"
          text={text}
          font={FONTS.RobotoSlab}
          anchorX="left"
          anchorY="middle"
          castShadow={true}
          receiveShadow={false}
        >
          <meshPhysicalMaterial
            attach="material"
            color="black"
            opacity={opacity}
            transparent
          />
        </text>
      </Fragment>
    )
    : null
}


interface LabelProps {
  opacity?:     number
  text:         string
  x:            number
}

function Label(props: LabelProps): ReactElement | null {
  const { text, x, opacity = 1 } = props

  const start = OFFSET + x * SCALAR

  return (
    <Fragment>
      <mesh position={[start, 0.5, -0.1]} rotation={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 5]}  />
        <meshPhysicalMaterial color={COLORS.MAIN.GREY} opacity={opacity} transparent />
      </mesh>
      <text
        // eslint-disable-next-line
          // @ts-ignore
        position={[start, -2.5, 0]}
        rotation={[0, 0, DEG_90]}
        fontSize={0.4}
        color={COLORS.TEXT.MAIN}
        maxWidth={300}
        lineHeight={1}
        letterSpacing={0}
        textAlign="left"
        text={text}
        font={FONTS.RobotoSlab}
        anchorX="center"
        anchorY="middle"
        castShadow={true}
        receiveShadow={false}
        frustumCulled={false}
      >
        <meshPhysicalMaterial
          attach="material"
          color="black"
          opacity={opacity}
          transparent
        />
      </text>
    </Fragment>
  )
}
