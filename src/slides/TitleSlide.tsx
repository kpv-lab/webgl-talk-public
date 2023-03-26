import { Fragment, ReactElement, useMemo } from 'react'
import { useBackground } from './Background'
import { Title } from './components/Title'
import { fadeIn, FadeState } from './effects'
import { useScript } from './Script'


interface Props {
  background?: string
  active:      number
  text:        string | string[]
  script?:     string | string[]
}

export function TitleSlide(props: Props): ReactElement {
  const { active, background, script, text } = props

  const fadeState = fadeIn(active)
  useBackground(background)
  useScript(script)

  return Array.isArray(text)
    ? <MultiLineTitle text={text} {...fadeState} />
    : <Title text={text} position={[0, 0, 0]} {...fadeState} />
}

interface MultiProps extends FadeState {
  text: string[]
}

function MultiLineTitle(props: MultiProps): ReactElement {
  const { text, opacity } = props

  const offsets = useMemo(() => text.map((_, i) => text.length / 2 - i), [text])

  return (
    <Fragment>
      { text.map((line, i) => (
        <Title key={i} text={line} position={[0, offsets[i], 0]} opacity={opacity} />
      )) }
    </Fragment>
  )
}
