import { useMemo } from 'react'
import { Ease, linear } from './ease'
import { ExposedPromise, makeExposedPromise } from './exposed-promise'
import { Lerp } from './lerp'

interface Props<T> {
  duration: number
  ease?:    Ease
  fn:       (value: T) => void
  lerp:     Lerp<T>
}

interface AnimLerp {
  play:  () => Promise<void>
  reset: () => void
}

export function useAnimLerp<T>(props: Props<T>): AnimLerp {
  const { lerp, duration, ease, fn } = props
  return useMemo(() => makeLerp<T>({ duration, ease, lerp, fn }), [])
}

export function makeLerp<T>(props: Props<T>): AnimLerp {
  const { duration, ease = linear, lerp, fn } = props

  let exposedPromise: ExposedPromise<void>
  let isPlaying = false
  let startTime = -1
  let time = -1

  return { play, reset }

  function play(): Promise<void> {
    if (!isPlaying) {
      isPlaying = true
      time = Date.now()
      startTime = time
      requestAnimationFrame(tick)
      exposedPromise = makeExposedPromise<void>()
    }
    return exposedPromise.promise
  }

  function reset(): void {
    isPlaying = false
    startTime = -1
    time = -1
    fn(lerp(ease(0)))
  }

  function tick(): void {
    const now = Date.now()
    time = now
    const delta = (time - startTime) / 1000
    const p = delta / duration
    fn(lerp(ease(p)))

    p >= 1
      ? exposedPromise.resolve()
      : next()

    function next(): void {
      requestAnimationFrame(tick)
    }
  }
}
