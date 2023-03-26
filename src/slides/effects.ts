import { expoIn, expoOut } from '../lib/ease'

export interface FadeState {
  opacity:     number
  transparent: true
}

export function fadeIn(active: number): FadeState {
  return { opacity: expoOut(active), transparent: true }
}

export interface ZoomState {
  scale: number
}

export function zoomIn(active: number): ZoomState {
  return { scale: 1 + 20 * expoIn(1 - active) }
}
