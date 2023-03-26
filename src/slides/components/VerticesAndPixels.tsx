import { Fragment, ReactElement, useEffect } from 'react'
import { bounceOut, linear, quadInOut } from '../../lib/ease'
import { makeColorLerp, makeLerp } from '../../lib/lerp'
import { useRegularPolygon } from '../../lib/regular-polygon'
import { AnimTimelineProps, useAnimTimeline } from '../../lib/use-anim-timeline'
import { useGetPolygonColor } from '../../lib/use-polygon-color'
import { useBackground } from '../Background'
import { useScript } from '../Script'
import { Grid } from './Grid'
import { Polyline } from './Polyline'
import { SubTitle } from './SubTitle'
import { Vertex } from './Vertex'

interface State {
  angularOffset: number
  colorA:        string
  colorB:        string
  colorC:        string
  drawnLine:     number
  gridOpacity:   number
  radiusA:       number
  radiusB:       number
  radiusC:       number
}

const ANIM: AnimTimelineProps<State> = {
  init: {
    angularOffset: Math.PI / 12,
    colorA: 'orange',
    colorB: 'orange',
    colorC: 'orange',
    drawnLine: 0,
    gridOpacity: 0,
    radiusA: 0,
    radiusB: 0,
    radiusC: 0,
  },
  config: [
    { ease: bounceOut, key: 'radiusA',       time: [0, 1.5],     value: makeLerp(0, 0.2), },
    { ease: bounceOut, key: 'radiusB',       time: [0.5, 3.0],   value: makeLerp(0, 0.2), },
    { ease: bounceOut, key: 'radiusC',       time: [1.0, 2.5],   value: makeLerp(0, 0.2), },
    { ease: quadInOut, key: 'drawnLine',     time: [5.0, 8.0],   value: makeLerp(0, 1),   },
    { ease: quadInOut, key: 'gridOpacity',   time: [10.0, 12.0], value: makeLerp(0, 1),   },
    { ease: quadInOut, key: 'colorA',        time: [18, 22],     value: makeColorLerp('orange', 'red'), },
    { ease: quadInOut, key: 'colorB',        time: [18, 22],     value: makeColorLerp('orange', 'green'), },
    { ease: quadInOut, key: 'colorC',        time: [18, 22],     value: makeColorLerp('orange', 'blue'), },
    { ease: linear,    key: 'angularOffset', time: [24, 30],     value: makeLerp(Math.PI / 12, 13 * Math.PI / 12), },
  ],
}

const SIZE = 0.3

interface Props {
  active:      number
  background?: string
  script?:     string | string[]
}

export function VerticesAndPixels(props: Props): ReactElement {
  const { active, background, script } = props

  useBackground(background)
  useScript(script)

  const { value, play } = useAnimTimeline<State>(ANIM)
  const { angularOffset, colorA, colorB, colorC, drawnLine, gridOpacity, radiusA, radiusB, radiusC } = value

  useEffect(() => {
    play?.()
  }, [play])

  const vertices = useRegularPolygon({ angularOffset, center: [0, 0, 0], radius: 2.5, sides: 3 })
  const container = useRegularPolygon({ angularOffset, center: [0, 0, 0], radius: 3.1, sides: 3 })
  const [a, b, c] = vertices

  const getColor = useGetPolygonColor({ colors: [colorA, colorB, colorC], size: SIZE, vertices: container })

  return (
    <Fragment>
      <SubTitle
        opacity={active}
        position={[0, -3, 0]}
        text="Vertices and Pixels"
      />
      <group>
        <Vertex
          color={colorA}
          opacity={active}
          position={a}
          radius={radiusA}
        />
        <Vertex
          color={colorB}
          opacity={active}
          position={b}
          radius={radiusB}
        />
        <Vertex
          color={colorC}
          opacity={active}
          position={c}
          radius={radiusC}
        />
        <Polyline
          color="black"
          opacity={active}
          partial={drawnLine}
          radius={0.02}
          vertices={vertices}
        />
        <Grid
          color={getColor}
          count={[40, 30]}
          opacity={active * gridOpacity}
          origin={[0,0,-1]}
          size={SIZE}
        />
      </group>
    </Fragment>
  )
}

