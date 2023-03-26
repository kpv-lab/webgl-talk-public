import { createContext, Dispatch, ReactElement, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import { clamp } from '../lib/math'

interface Props {
  children: ReactElement | ReactElement[]
}

interface TimelineContextState {
  define:   (scope: TimelineScope) => VoidFunction
  getDots:  (setDots: Dispatch<SetStateAction<TimelineDot[]>>) => (state: number) => void
  setState: (state: number) => void
}

interface TimelineProps {
  max:         number
  speed:       number
}

interface TimelineScope extends TimelineProps {
  setPosition: Dispatch<SetStateAction<number>>
}

export interface TimelineDot {
  active: number // 0..1
  index:  number
}

const Context = createContext<TimelineContextState>(null as any as TimelineContextState)

export function useTimelineScope(props: TimelineProps): [number, Dispatch<SetStateAction<number>>] {
  const { max, speed } = props

  const context = useContext<TimelineContextState>(Context)
  const [position, setPosition] = useState(0)

  useEffect(() => {
    return context.define({ max, speed, setPosition }) // will unmount timeline scope when calling component unmounts.
  }, [])

  return [position, setPosition]
}

export function useTimelineDots(setDots: Dispatch<SetStateAction<TimelineDot[]>>): (manual: number) => void {
  const { getDots } = useContext<TimelineContextState>(Context)
  return getDots(setDots)
}

export function TimelineContext(props: Props): ReactElement {
  const { children } = props

  const { define, getDots, setState } = useMemo(() => {
    let scope: TimelineScope | undefined
    let value:  number
    let target: number
    let setDots: Dispatch<SetStateAction<TimelineDot[]>>
    let isManualUpdate = false

    let cancel: number | undefined
    let then: number

    return { getDots, setState, define }

    function getDots(definedSetDots: Dispatch<SetStateAction<TimelineDot[]>>): (manaual: number) => void {
      if (setDots !== definedSetDots) {
        setDots = definedSetDots
      }

      return setState
    }

    function updateDots(): void {
      const state = getState()
      setDots?.(state)
    }

    function getState(): TimelineDot[] {
      const { max } = scope ?? { max: -1 }

      return Array.from({ length: max + 1 }, getDot)

      function getDot(_: any, index: number): TimelineDot {
        const distance = target - index
        const active = clamp(1 - Math.abs(distance), 0, 1)

        return { index, active }
      }
    }

    function setState(manual: number): void {
      target = manual
      isManualUpdate = true
      updateDots()
    }

    function define(definedScope: TimelineScope): VoidFunction {
      if (scope !== definedScope) {
        scope = definedScope
        value = 0
        target = 0

        if (scope) {
          window.addEventListener('keyup', onKey)
          then = Date.now()
          cancel = requestAnimationFrame(tick)
        }
      }

      return function pop(): void {
        scope = undefined
        value = -1
        target = -1
        window.removeEventListener('keyup', onKey)
        cancelAnimationFrame(cancel!)
      }
    }

    function onKey(event: KeyboardEvent): void {
      switch (event.key) {
        case 'ArrowLeft':  return left(event)
        case 'ArrowRight': return right(event)
      }
    }

    function left(event: KeyboardEvent): void {
      target = Math.max(target - 1, 0)
    }

    function right(event: KeyboardEvent): void {
      target = Math.min(target + 1, scope!.max)
    }

    function tick(): void {
      requestAnimationFrame(tick)

      const now = Date.now()
      const deltaTime = (now - then) / 1000
      then = now

      const { speed, setPosition } = scope ?? { speed: 0, setPosition: () => void 0 }
      const delta = target - value

      if (delta !== 0 || isManualUpdate) {
        isManualUpdate = false
        updateScope()
      }

      function updateScope(): void {
        const direction = Math.sign(delta)
        const deltaValue = speed * deltaTime

        if (direction === 1 && deltaValue < delta) {
          value += deltaValue
          if (delta > 1 && value % 1 > 0.5) {
            value = target - 0.5
          }
        } else if (direction === -1 && deltaValue > delta) {
          value -= deltaValue
          if (delta < -1 && value % 1 < 0.5) {
            value = target + 0.5
          }
        } else {
          value = target
        }

        setPosition(value)
        updateDots()
      }
    }
  }, [])

  useEffect(() => {
    setState(Number(location.hash.slice(1)))
  }, [setState, location.hash])

  return (
    <Context.Provider value={{ setState, getDots, define }}>
      { children }
    </Context.Provider>
  )
}
