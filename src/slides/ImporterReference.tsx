import { useLoader } from '@react-three/fiber'
import { Fragment, ReactElement, useEffect } from 'react'
import { TextureLoader } from 'three'
import { SubTitle } from './components/SubTitle'

import { OrbitControls } from '@react-three/drei'
import { quadInOut } from '../lib/ease'
import { makeLerp } from '../lib/lerp'
import { sleep } from '../lib/sleep'
import { AnimTimelineProps, useAnimTimeline } from '../lib/use-anim-timeline'
import { useFlip } from '../lib/use-flip'
import { useBackground } from './Background'
import { useScript } from './Script'
import importerFish from '/src/assets/importer-fish.png'
import importerSplash from '/src/assets/importer-splash.png'

interface State {
  panel: number
}

const ANIM: AnimTimelineProps<State> = {
  init: {
    panel: 0,
  },
  config: [
    { ease: quadInOut, key: 'panel', time: [0, 5], value: makeLerp(0, 1) },
    { ease: quadInOut, key: 'panel', time: [10, 15], value: makeLerp(1, 0) },
  ],
}

interface Props {
  active:      number
  background?: string
  script?:     string | string[]
}

export function ImporterReference(props: Props): ReactElement {
  const { active, background, script } = props

  useBackground(background)
  useScript(script)

  const [splashMap, fishMap] = useLoader(TextureLoader, [importerSplash, importerFish])

  const { value, play } = useAnimTimeline<State>(ANIM)
  const { panel } = value

  useEffect(() => {
    sequence()

    async function sequence(): Promise<void> {
      await sleep(5)
      await play?.()
    }
  }, [play])

  const { left, right } = useFlip({ dx: 3.3 })

  return (
    <Fragment>
      <OrbitControls />
      <SubTitle position={[0, 3, 0]} text="gltf.pmnd.rs" opacity={active} />
      <mesh {...left(panel)} scale={0.5}>
        <planeGeometry args={[12.8, 8]} />
        <meshBasicMaterial map={splashMap} opacity={active} transparent />
      </mesh>
      <mesh {...right(panel)} scale={0.5}>
        <planeGeometry args={[12.8, 8]} />
        <meshBasicMaterial map={fishMap} opacity={active} transparent />
      </mesh>
      <SubTitle position={[0, -3, 0]} text="Generates fiber code for GLTF/GLB files" opacity={active} />
    </Fragment>
  )
}
