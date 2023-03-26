import { useFrame, useThree } from '@react-three/fiber'
import { Fragment, ReactElement, useEffect } from 'react'
import { Vector3 } from 'three'
import { COLORS } from '../../assets/colors'
import { quadInOut } from '../../lib/ease'
import { Lerp, makeColorLerp, makeLerp, makeNumberArrayLerp } from '../../lib/lerp'
import { getDirection, useRegularPolygon } from '../../lib/regular-polygon'
import { sleep } from '../../lib/sleep'
import { AnimTimelineProps, useAnimTimeline } from '../../lib/use-anim-timeline'
import { useGetPolygonColor } from '../../lib/use-polygon-color'
import { useBackground } from '../Background'
import { useScript } from '../Script'
import { Grid } from './Grid'
import { Normal } from './Normal'
import { Polyline } from './Polyline'
import { SubTitle } from './SubTitle'
import { Vertex } from './Vertex'

interface State {
  angularOffset:  number
  cameraPosition: [number, number, number]
  colorA:         string
  colorB:         string
  colorC:         string
  drawnLine:      number
  fakeColorA:     string
  fakeColorB:     string
  fakeColorC:     string
  gridOpacity:    number
  labels:         number
  normalA:        [number, number, number]
  normalB:        [number, number, number]
  normalC:        [number, number, number]
  radiusA:        number
  radiusB:        number
  radiusC:        number
  showNormals:    number
  shiny:          number
}

const A_TARGET = fromDirection(0)
const B_TARGET = fromDirection(1)
const C_TARGET = fromDirection(2)

const ANIM: AnimTimelineProps<State> = {
  init: {
    angularOffset: 13 * Math.PI / 12,
    cameraPosition: [0, 0, 5],
    colorA: 'red',
    colorB: 'green',
    colorC: 'blue',
    drawnLine: 1,
    fakeColorA: 'red',
    fakeColorB: 'green',
    fakeColorC: 'blue',
    gridOpacity: 1,
    labels: 0,
    normalA: [0, 0, 1],
    normalB: [0, 0, 1],
    normalC: [0, 0, 1],
    radiusA: 0.2,
    radiusB: 0.2,
    radiusC: 0.2,
    shiny:   0,
    showNormals: 0,
  },
  config: [
    { ease: quadInOut, key: 'fakeColorA',     time: [0, 2],   value: makeColorLerp('red', COLORS.NORMAL_SHADE) },
    { ease: quadInOut, key: 'fakeColorB',     time: [0, 2],   value: makeColorLerp('green', COLORS.NORMAL_SHADE) },
    { ease: quadInOut, key: 'fakeColorC',     time: [0, 2],   value: makeColorLerp('blue', COLORS.NORMAL_SHADE) },
    { ease: quadInOut, key: 'showNormals',    time: [5, 8],   value: makeLerp(0, 1) },
    { ease: quadInOut, key: 'colorA',         time: [5, 8],   value: makeColorLerp('red', 'white') },
    { ease: quadInOut, key: 'colorB',         time: [5, 8],   value: makeColorLerp('green', 'white') },
    { ease: quadInOut, key: 'colorC',         time: [5, 8],   value: makeColorLerp('blue', 'white') },
    { ease: quadInOut, key: 'labels',         time: [12, 20], value: makeLerp(0, 1) },
    { ease: quadInOut, key: 'cameraPosition', time: [12, 20], value: makeNumberArrayLerp([0, 0, 5], [0, -4, 4]) as Lerp<[number, number, number]> },
    { ease: quadInOut, key: 'shiny',          time: [12, 25], value: makeLerp(0, 1) },
    { ease: quadInOut, key: 'colorA',         time: [25, 32], value: makeColorLerp('white', COLORS.NORMAL_SHADE) },
    { ease: quadInOut, key: 'colorB',         time: [25, 32], value: makeColorLerp('white', COLORS.NORMAL_SHADE) },
    { ease: quadInOut, key: 'colorC',         time: [25, 32], value: makeColorLerp('white', COLORS.NORMAL_SHADE) },
    { ease: quadInOut, key: 'normalA',        time: [25, 35], value: makeNumberArrayLerp([0, 0, 1], A_TARGET) as Lerp<[number, number, number]> },
    { ease: quadInOut, key: 'normalB',        time: [25, 35], value: makeNumberArrayLerp([0, 0, 1], B_TARGET) as Lerp<[number, number, number]> },
    { ease: quadInOut, key: 'normalC',        time: [25, 35], value: makeNumberArrayLerp([0, 0, 1], C_TARGET) as Lerp<[number, number, number]> },
    { ease: quadInOut, key: 'cameraPosition', time: [45, 50], value: makeNumberArrayLerp([0, -4, 4], [0, 0, 5]) as Lerp<[number, number, number]> },
    { ease: quadInOut, key: 'labels',         time: [45, 50], value: makeLerp(1, 0) },
  ],
}

function fromDirection(vertex: number): [number, number, number] {
  const [x, y]  = getDirection({ angularOffset: 13 * Math.PI / 12, sides: 3, vertex })
  return new Vector3(-x, -y, 1).normalize().toArray()
}

function average(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  return new Vector3(...a).add(new Vector3(...b)).divideScalar(2).toArray()
}

function normalize(a: [number, number, number]): [number, number, number] {
  return new Vector3(...a).normalize().toArray()
}

const SIZE = 0.3

interface Props {
  active:      number
  background?: string
  script?:     string | string[]
}

export function VerticesAndNormals(props: Props): ReactElement {
  const { active, background, script } = props

  useBackground(background)
  useScript(script)

  const { value, play } = useAnimTimeline<State>(ANIM)
  const {
    angularOffset, colorA, colorB, colorC, drawnLine, gridOpacity, normalA, normalB, normalC, radiusA, radiusB,
    radiusC, shiny, labels, fakeColorA, fakeColorB, fakeColorC, showNormals,
  } = value

  useEffect(() => {
    sequence()

    async function sequence(): Promise<void> {
      await sleep(5)
      await play?.()
    }
  }, [play])

  useFrame(({ camera }) => {
    camera.position.set(...value.cameraPosition)
    camera.lookAt(0, 0, 0)
  })

  const { camera } = useThree()

  useEffect(() => {
    return function unmount(): void {
      camera.position.set(0, 0, 5)
      camera.lookAt(0, 0, 0)
    }
  }, [camera])

  const vertices = useRegularPolygon({ angularOffset, center: [0, 0, 0], radius: 2.5, sides: 3 })
  const container = useRegularPolygon({ angularOffset, center: [0, 0, 0], radius: 3.1, sides: 3 })
  const anchors = useRegularPolygon({ angularOffset: angularOffset + Math.PI / 2, center: [0, 0, 0], radius: 6, sides: 3 })
  const [a, b, c] = vertices
  const [d, e, f] = anchors

  const getColor = useGetPolygonColor({
    colors: [colorA, colorB, colorC, '#ffffff', colorA, colorB, colorC],
    size:   SIZE,
    vertices: container,
    extra: [[0, 0, 0], d, e, f],
    weights: [1, 1, 1, shiny, shiny, shiny, shiny],
  })

  return (
    <Fragment>
      <SubTitle position={[0, -3, 0]} text="Normals and Light" />
      <SubTitle position={[2.5, 0, 0]} text="Vertex Shader" opacity={labels} scale={0.5} />
      <SubTitle position={[3.0, 0, -1]} text="Fragment Shader" opacity={labels} scale={0.5} />
      <group>
        <Vertex color={fakeColorA} position={a} radius={radiusA} opacity={active} />
        <Vertex color={fakeColorB} position={b} radius={radiusB} opacity={active} />
        <Vertex color={fakeColorC} position={c} radius={radiusC} opacity={active} />
        <Normal color={COLORS.NORMAL_ARROW} position={a} normal={normalA} opacity={active * showNormals} />
        <Normal color={COLORS.NORMAL_ARROW} position={b} normal={normalB} opacity={active * showNormals} />
        <Normal color={COLORS.NORMAL_ARROW} position={c} normal={normalC} opacity={active * showNormals} />
        <Polyline
          color="black"
          partial={drawnLine}
          radius={0.02}
          vertices={vertices}
        />
        <Grid
          color={getColor}
          count={[40, 30]}
          opacity={gridOpacity}
          origin={[0,0,-1]}
          size={SIZE}
        />
      </group>
    </Fragment>
  )
}

