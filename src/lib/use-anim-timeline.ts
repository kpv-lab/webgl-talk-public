import { useFrame } from '@react-three/fiber'
import produce from 'immer'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ExposedPromise, makeExposedPromise } from './exposed-promise'

export interface AnimConfig<Value, Key extends keyof Value> {
  time:  [number, number]
  ease:  (t: number) => number
  value: (p: number) => Value[Key]
  key:    Key
}

export interface AnimTimelineProps<Value> {
  config: AnimConfig<Value, keyof Value>[]
  init:   Value
  time?:  number
}

interface AnimTimeline<Value> {
  value:   Value
  play:    () => Promise<boolean> // returns true if animation is finished
  stop:    () => void
  reset:   () => void
  setTime: (time: number) => void
}

export function useAnimTimeline<Value>(props: AnimTimelineProps<Value>): AnimTimeline<Value> {
  const { config, init, time: forcedTime } = props

  const playingPromise = useRef<ExposedPromise<boolean> | null>(null)
  const [time, setTime] = useState(forcedTime ?? 0)
  const [value, setValue] = useState<Value>(init as Value)

  const finished = useMemo(() => Math.max(...config.map(({ time: [, end] }) => end)), [config])

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

  useEffect(() => {
    setValue(updateValue)
    if (time >= finished) {
      playingPromise.current?.resolve(true)
    }

    function updateValue(value: Value): Value {
      const active = config.filter(({ time: [start, end] }) => time >= start)

      return produce(value, draft => {
        active.forEach(({ time: [start, end], key, value, ease }) => {
          // eslint-disable-next-line
          // @ts-ignore
          draft[key] = value(ease(Math.min((time - start) / (end - start), 1)))
        })
      })
    }
  }, [time])

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)

    return function unmount(): void {
      window.removeEventListener('keydown', onKeyDown)
    }

    function onKeyDown(e: KeyboardEvent): void {
      if (e.key === ' ') {
        playingPromise.current ? stop() : play()
      }
    }
  }, [play, stop, playingPromise])

  return { play, reset, setTime, stop, value }

}
