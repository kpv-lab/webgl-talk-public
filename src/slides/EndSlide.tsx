import { ReactElement } from 'react'
import { useBackground } from './Background'
import { SubTitle } from './components/SubTitle'
import { Title } from './components/Title'
import { zoomIn } from './effects'
import { useScript } from './Script'
import { useGentleRotation } from './use-gentle-rotation'

interface Props {
  active:      number
  background?: string
  script?:     string | string[]
}

export function EndSlide(props: Props): ReactElement {
  const { active, background, script } = props

  useBackground(background)
  useScript(script)
  useGentleRotation(-0.3, active)
  const zoomState = zoomIn(active)

  return (
    <group>
      <Title position={[0, 0.4, 1]} text="@alecmce" {...zoomState} castShadow />
      <SubTitle position={[0, -0.4, 0]} text="KPV Lab, Edinburgh" {...zoomState} castShadow />
    </group>
  )
}
