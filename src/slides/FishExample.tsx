import { Fragment, ReactElement } from 'react'
import { quadIn, quadInOut } from '../lib/ease'
import { makeLerp } from '../lib/lerp'
import { AnimTimelineProps, useAnimTimeline } from '../lib/use-anim-timeline'
import { useBackground } from './Background'
import { ClownFish } from './components/ClownFish'
import { Code } from './components/Code'
import { useScript } from './Script'

import text from '/src/assets/fish-example.txt?raw'

interface Props {
  active:      number
  background?: string
  script?:     string | string[]
}

interface State {
  opacity: number
  deltaX:  number
  deltaY:  number
  scale:   number
}

const ANIM: AnimTimelineProps<State> = {
  init: { opacity: 0, deltaX: 0, deltaY: 0, scale: 1 },
  config: [
    { ease: quadInOut, key: 'opacity', time: [0, 3],  value: makeLerp(0, 1), },
    { ease: quadIn,    key: 'deltaX',  time: [3, 13], value: makeLerp(0, 12), },
    { ease: quadIn,    key: 'deltaY',  time: [3, 13], value: (p: number) => Math.sin(p) * 2 },
    { ease: quadInOut, key: 'scale',   time: [4, 10], value: makeLerp(1, 0.4) },
  ],
}

export function FishExample(props: Props): ReactElement {
  const { active, background, script } = props

  useBackground(background)
  useScript(script)

  const { value, play } = useAnimTimeline(ANIM)
  const { opacity, deltaX, deltaY } = value

  return (
    <Fragment>
      <Code position={[0, 0, 2]} scale={0.6} text={text} onComplete={play} opacity={active} transparent />
      { opacity > 0 && (
        <ClownFish
          opacity={opacity * active}
          position={[deltaX, deltaY, -1]}
          transparent
        />
      )}
    </Fragment>
  )
}
