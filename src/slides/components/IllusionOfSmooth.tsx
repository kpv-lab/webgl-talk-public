import { useFrame, useThree } from '@react-three/fiber'
import { Fragment, ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { BufferAttribute, BufferGeometry, DoubleSide, Mesh, Vector3 } from 'three'
import { VertexNormalsHelper } from 'three-stdlib/helpers/VertexNormalsHelper'
import { lerp } from 'three/src/math/MathUtils'
import { COLORS } from '../../assets/colors'
import { quadInOut } from '../../lib/ease'
import { makeLerp } from '../../lib/lerp'
import { sleep } from '../../lib/sleep'
import { AnimTimelineProps, useAnimTimeline } from '../../lib/use-anim-timeline'
import { useColorCycle } from '../../lib/use-color-cycle'
import { DEG_15, DEG_45 } from '../../lib/util'
import { useBackground } from '../Background'
import { useScript } from '../Script'
import { SubTitle } from './SubTitle'

interface State {
  smooth: number
}

const ANIM: AnimTimelineProps<State> = {
  init: {
    smooth: 1,
  },
  config: [
    { ease: quadInOut, key: 'smooth', time: [0, 5], value: makeLerp(1, 0) },
    { ease: quadInOut, key: 'smooth', time: [10, 15], value: makeLerp(0, 1) },
  ],
}

interface Props {
  active:      number
  background?: string
  script?:     string[] | string
}

export function IllusionOfSmooth(props: Props): ReactElement {
  const { active, background, script } = props

  useBackground(background)
  useScript(script)

  const { value, play, reset } = useAnimTimeline<State>(ANIM)
  const { smooth } = value

  useEffect(() => {
    sequence()

    async function sequence(): Promise<void> {
      await play?.()
      reset()
      await sleep(5)
      sequence()
    }
  }, [play])

  const [mesh, setMesh] = useState<Mesh | null>(null)
  const [color, setColor] = useState<number>(0)
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null)
  const [rotation, setRotation] = useState<[number, number, number]>([DEG_45, DEG_15, DEG_45])
  const getColor = useColorCycle(COLORS.RAINBOW)
  const helper = useRef<VertexNormalsHelper | null>(null)

  useNormals(geometry, smooth)

  useFrame((_, delta) => {
    setColor(color => color + delta * 0.3)
    setRotation(([x, y, z]) => [x + delta * 0.3, y + delta * 0.5, z])
  })

  useEffect(() => {
    if (mesh && geometry && geometry.index) {
      mesh.geometry = geometry?.toNonIndexed()
      setGeometry(mesh.geometry)
    }
  }, [mesh, geometry, setGeometry])

  const { scene } = useThree()

  useEffect(() => {
    if (mesh) {
      if (!helper.current) {
        helper.current = new VertexNormalsHelper(mesh, 0.4, 0xffffff)
        scene.add(helper.current)
      }
    }

    return function unmount(): void {
      if (helper.current) {
        scene.remove(helper.current)
        helper.current = null
      }
    }
  }, [mesh, helper])

  helper.current?.update()

  return (
    <Fragment>
      <SubTitle position={[0, 3, 0]} text="The Illusion of Smooth" />
      <SubTitle position={[0, -3, 0]} text="Normals allow flat polygons to look curved" />
      <spotLight position={[-5, 5, 0]} />
      <spotLight position={[5, 5, 0]} />
      <spotLight position={[0, 0, 0]} />
      <mesh ref={setMesh} position={[0, 0, 0]} rotation={rotation}>
        <cylinderGeometry args={[1, 1, 3, 16, 1, true]} ref={setGeometry} />
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.25}
          color={getColor(color)}
          metalness={1}
          opacity={active}
          reflectivity={1}
          roughness={0.3}
          side={DoubleSide}
          transparent
        />
      </mesh>
    </Fragment>
  )
}

function useNormals(geometry: BufferGeometry | null, p: number): void {
  const positionAttribute = geometry && !geometry.index ? geometry.getAttribute('position') as BufferAttribute : undefined
  const normalAttribute = geometry && !geometry.index ? geometry.getAttribute('normal') as BufferAttribute : undefined

  const [smooth, facetted] = useMemo(() => {
    return positionAttribute && normalAttribute ? getData(positionAttribute, normalAttribute) : []

    function getData(positionAttribute: BufferAttribute, normalAttribute: BufferAttribute): [smooth: Vector3[], facetted: Vector3[]] {

      const positions = Array.from({ length: positionAttribute.count }).map(getPositions)
      const smooth = Array.from({ length: normalAttribute.count }).map(getSmoothNormal)
      const facetted = Array.from({ length: 16 }).map(getFacettedNormal)

      return [smooth, facetted]

      function getPositions(_: unknown, i: number): Vector3 {
        return new Vector3(positionAttribute.getX(i), positionAttribute.getY(i), positionAttribute.getZ(i))
      }

      function getSmoothNormal(_: unknown, i: number): Vector3 {
        return new Vector3(normalAttribute.getX(i), normalAttribute.getY(i), normalAttribute.getZ(i))
      }

      function getFacettedNormal(_: unknown, i: number): Vector3 {
        const a = positions[6 * i + 0]
        const b = positions[6 * i + 1]
        const c = positions[6 * i + 2]
        return new Vector3().crossVectors(c.clone().sub(b), a.clone().sub(c)).normalize()
      }
    }
  }, [positionAttribute, normalAttribute])

  useEffect(() => {
    normalAttribute && smooth && facetted && update(normalAttribute, facetted, smooth)

    function update(normalAttribute: BufferAttribute, facetted: Vector3[], smooth: Vector3[]): void {
      for (let i = 0; i < 16; i++) {
        const f = facetted[i]
        for (let j = 0; j < 6; j++) {
          const s = smooth[6 * i + j]
          normalAttribute.setXYZ(6 * i + j, lerp(f.x, s.x, p), lerp(f.y, s.y, p), lerp(f.z, s.z, p))
        }
      }
      normalAttribute.needsUpdate = true
    }
  }, [smooth, facetted, p])
}
