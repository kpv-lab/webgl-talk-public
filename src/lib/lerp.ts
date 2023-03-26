import chroma from 'chroma-js'

export interface Lerp<T = number> {
  (t: number): T;
}

export function makeLerp(start: number, end: number): Lerp {
  const delta = end - start

  return function lerp(t: number): number {
    return start + t * delta
  }
}

export function makeArrayLerp<T>(start: T[], end: T[], fn: (a: T, b: T) => Lerp<T>): Lerp<T[]> {
  const lerps = start.map((s, i) => fn(s, end[i]))

  return function lerp(t: number): T[] {
    return lerps.map(lerp => lerp(t))
  }
}

export function makeNumberArrayLerp(start: number[], end: number[]): Lerp<number[]> {
  return makeArrayLerp(start, end, makeLerp)
}

export function makeColorLerp(start: string, end: string): Lerp<string> {
  return function lerp(t: number): string {
    return chroma.mix(start, end, t).hex()
  }
}
