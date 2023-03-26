import { useEffect, useMemo, useState } from 'react'
import { Lerp, makeLerp } from '../lib/lerp'
import { useAnimLerp } from '../lib/use-anim-lerp'

interface FishLerp {
  play:     VoidFunction
  position: [number, number, number]
}

interface Props {
  x?:        [number, number]
  y?:        number
  duration?: number
}

export function useSwimBy(props: Props): [number, number, number] {
  const { x = [10, -10], y = 0, duration = 20 } = props

  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0])

  const lerp = useMemo(() => {
    return makeFishLerp()

    function makeFishLerp(): Lerp<[number, number, number]> {
      const fx = makeLerp(x[0], x[1])
      let angle = 0

      return function lerp(p: number): [number, number, number] {
        angle += Math.PI * p / 1000
        const dy = Math.sin(angle) * 2
        return [fx(p), y + dy, 0.5]
      }
    }
  }, [x[0], x[1], y])

  const anim = useAnimLerp({ duration, fn: setPosition, lerp })

  useEffect(() => {
    let isMounted = true
    loop()

    async function loop(): Promise<void> {
      await anim.play()
      anim.reset()
      isMounted && loop()
    }

    return function unmount(): void {
      isMounted = false
    }
  }, [anim])

  return position
}

