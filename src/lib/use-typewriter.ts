import { useFrame } from '@react-three/fiber'
import { useCallback, useMemo, useRef, useState } from 'react'
import { ExposedPromise, makeExposedPromise } from './exposed-promise'

interface Typewriter {
  play:  () => Promise<boolean>
  stop:  () => void
  reset: () => void
  value: string
}

interface Props {
  delay?:      [number, number]
  forcedTime?: number
  text:        string
}

export function useTypewriter(props: Props): Typewriter {
  const { delay = [0.05, 0.1], forcedTime, text } = props

  const playingPromise = useRef<ExposedPromise<boolean> | null>(null)
  const cumulativeTimes = useMemo(() => getTimes(text, delay), [text, ...delay])

  const [time, setTime] = useState(forcedTime ?? 0)

  const play = useCallback((): Promise<boolean> => {
    playingPromise.current ??= makeExposedPromise<boolean>()
    return playingPromise.current.promise
  }, [playingPromise])

  const stop = useCallback((): void => {
    playingPromise.current?.resolve(false)
    playingPromise.current = null
  }, [playingPromise])

  const reset = useCallback((): void => {
    playingPromise.current?.resolve(false)
    playingPromise.current = null
    setTime(0)
  }, [playingPromise])

  useFrame((_, delta) => {
    if (playingPromise.current) {
      setTime(t => forcedTime !== undefined ? forcedTime : t + delta)
    }
  })
  const index = cumulativeTimes.filter(t => t <= time).length
  const isComplete = index === cumulativeTimes.length
  const value = isComplete ? text : text.slice(0, index) + ''

  if (isComplete && playingPromise.current) {
    playingPromise.current.resolve(true)
    playingPromise.current = null
  }

  return { play, stop, reset, value }

}

function getTimes(text: string, [min, max]: [number, number]): number[] {
  const times = []

  let time = 0
  for (let i = 0; i < text.length; i++) {
    time += Math.random() * (max - min) + min
    times.push(time)
  }

  return times
}
