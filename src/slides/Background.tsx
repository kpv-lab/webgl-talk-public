import { useFrame } from '@react-three/fiber'
import chroma from 'chroma-js'
import { createContext, MutableRefObject, ReactElement, useContext, useRef, useState } from 'react'
import { Plane } from './components/Plane'

const Context = createContext<MutableRefObject<string>>(null as any as MutableRefObject<string>)

interface Props {
  children: ReactElement | ReactElement[]
  color:    string
}


export function Background(props: Props): ReactElement {
  const { children } = props
  const initialColor = chroma(props.color).hex()

  const [color, setColor] = useState(initialColor)

  const target = useRef(initialColor)
  const interim = useRef({ position: 1, previous: initialColor, target: initialColor })

  useFrame((_: any, delta: number) => {
    const givenTarget = chroma(target.current).hex()
    const { position, previous, target: knownTarget } = interim.current

    const isChanged = givenTarget !== knownTarget

    if (isChanged) {
      const current = chroma.mix(previous, knownTarget, position).hex()
      interim.current = { position: 0, previous: current, target: givenTarget }
    } else if (position < 1) {
      interim.current.position += delta * 0.5
      setColor(chroma.mix(previous, target.current, position).hex())
    }
  })

  return (
    <Context.Provider value={target}>
      <Plane color={color} />
      { children }
    </Context.Provider>
  )
}

export function useBackground(color: string | undefined): void {
  const target = useContext<MutableRefObject<string>>(Context)!
  if (color) {
    target.current = chroma(color).hex()
  }
}
