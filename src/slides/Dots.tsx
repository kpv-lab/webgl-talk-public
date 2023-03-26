import { ReactElement, useState } from 'react'
import { TimelineDot, useTimelineDots } from './TimelineContext'


export function Dots(): ReactElement {
  const [dots, setDots] = useState<TimelineDot[]>([])
  const setState = useTimelineDots(setDots)

  return (
    <div className="dot-group">
      { dots.map((dots, i) => <Dot key={i} {...dots} setState={setState} />) }
    </div>
  )
}

interface DotProps {
  index:    number
  active:   number
  setState: (state: number) => void
}

function Dot(props: DotProps): ReactElement {
  const { active, index, setState } = props

  return (
    <div className="dot" onClick={() => setState(index)}>
      <div className="inner" style={{opacity: active}}/>
    </div>
  )
}
