import { ReactElement } from 'react'
import { useTimelineScope } from '../slides/TimelineContext'


interface Props {
  slides:    Slide[]
  speed?:    number
}

interface Slide {
  (active: number): ReactElement
}

export function useSlides(props: Props): ReactElement {
  const { speed = 0.5, slides } = props

  const [slidePosition] = useTimelineScope({ max: slides.length - 1, speed })

  const index = Math.round(slidePosition)
  const active = 1 - Math.abs(2 * (slidePosition - index))
  return slides[index]?.(active)
}
