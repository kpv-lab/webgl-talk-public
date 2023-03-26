export function smoothstep(min: number, max: number, value: number): number {
  const p = clamp((value - min) / (max - min), 0.0, 1.0)
  return p * p * (3.0 - 2.0 * p)
}

export function mix(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1)
}

export function clamp(p: number, min: number, max: number): number {
  return Math.min(Math.max(p, min), max)
}

export function getProportion(p: number, min: number, max: number): number {
  return (p - min) / (max - min)
}
