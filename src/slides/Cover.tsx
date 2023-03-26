import { ReactElement } from 'react'
import { useBackground } from './Background'
import { ClownFish } from './components/ClownFish'
import { SubTitle } from './components/SubTitle'
import { Title } from './components/Title'
import { fadeIn, zoomIn } from './effects'
import { useScript } from './Script'
import { useGentleRotation } from './use-gentle-rotation'
import { useSwimBy } from './use-swim-by'

const BASE_TEXT_OFFSET = -0.4

interface Props {
  active:      number
  background?: string
  script?:     string | string[]
}

export function Cover(props: Props): ReactElement {
  const { active, background, script } = props

  useGentleRotation(0.5, active)
  useBackground(background)
  useScript(script)

  const fishPosition = useSwimBy({ duration: 20, x: [10, -10], y: 0 })
  const fadeState = fadeIn(active)
  const zoomState = zoomIn(active)

  return (
    <group>
      <group position={[0,BASE_TEXT_OFFSET,0]}>
        <Title
          {...fadeState}
          {...zoomState}
          castShadow
          position={[0, 0.2, 0]}
          receiveShadow
          text="Introduction to WebGL"
        />
        <SubTitle
          {...fadeState}
          {...zoomState}
          castShadow
          position={[0, -0.4, 0]}
          receiveShadow
          text="Alec McEachran"
        />
      </group>
      <ClownFish
        {...fadeState}
        castShadow
        position={fishPosition}
      />
    </group>
  )
}

