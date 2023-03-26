import { useMemo } from 'react'
import { Ease, linear } from './ease'

interface Props {
  count:    number
  duration: number
  ease?:    Ease
  fn:       VoidFunction
}

interface Trigger {
  (): Promise<void>
}

export function useAnimTrigger(props: Props, deps?: unknown[]): Trigger {
  const { count, duration, ease, fn } = props
  return useMemo(() => makeTrigger({ count, duration, ease, fn }), deps ?? [count, duration, ease, fn])
}

export function makeTrigger(props: Props): Trigger {
  const { count, duration, ease = linear, fn } = props

  let resolve: VoidFunction
  const promise = new Promise<void>((__resolve) => {
    resolve = __resolve
  })
  let isPlaying = false
  let start = -1
  let time = -1
  let threshold = 0

  return function play(): Promise<void> {
    if (!isPlaying) {
      isPlaying = true
      time = Date.now()
      start = time
      requestAnimationFrame(tick)
    }
    return promise
  }

  function tick(): void {
    if (threshold < count) {
      requestAnimationFrame(tick)
      const now = Date.now()
      time = now
      update()
    } else {
      resolve()
    }
  }

  function update(): void {
    const delta = (time - start) / 1000
    const p = ease(delta / duration) * count

    while (p > threshold && threshold < count) {
      fn()
      threshold += 1
    }
  }
}
