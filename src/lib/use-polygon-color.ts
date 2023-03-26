import chroma from 'chroma-js'
import { Point, pointInPolygon, Polygon } from 'geometric'
import { useCallback } from 'react'

interface Props {
  colors:   string[]
  size:     number
  vertices: [number, number, number][]
  extra?:   [number, number, number][]
  weights?: number[]
}

interface GetColor {
  (point: Point): string
}


export function useGetPolygonColor(props: Props): GetColor {
  const { colors, extra = [], size, vertices, weights } = props

  const polygon = vertices as unknown as Polygon

  return useCallback((center: Point): string => {
    return pointInPolygon(center, polygon)
      ? getColor(center)
      : ''

    type VO = [distance: number, weight: number, color: string]

    function getColor(center: Point): string {
      const list = [...vertices, ...(extra ?? [])]
        .map((v, i) => [Math.hypot(center[0] - v[0], center[1] - v[1]), weights?.[i] ?? 1, colors[i]] as VO)
        .filter(([,weight]) => weight > 0)

      const total = list.reduce((acc, vo) => acc + vo[1], 0)
      const colorWeights = list.map(([distance, weight], i) => weight * total / (distance === 0 ? 0.1 : distance))

      const value = chroma.average(list.map(vo => vo[2]), 'rgb', colorWeights).hex('rgb')
      return value
    }
  }, [colors, size, ...vertices, ...(weights ?? []), ...(extra ?? [])])
}
