import { ReactElement } from 'react'
import { COLORS } from '../../assets/colors'
import { FONTS } from '../../assets/fonts'

interface Props {
  castShadow?:    boolean
  position?:      [number, number, number]
  opacity?:       number
  receiveShadow?: boolean
  scale?:         number
  text:           string | string[]
}

export function Title(props: Props): ReactElement {
  const { text, position=[0, 0, 0], scale = 1, opacity = 1, castShadow, receiveShadow } = props

  return (
    <text
      // eslint-disable-next-line
      // @ts-ignore
      anchorX="center"
      anchorY="middle"
      color={COLORS.TEXT.TITLE}
      font={FONTS.RobotoSlab}
      fontSize={0.7}
      letterSpacing={0}
      lineHeight={1}
      maxWidth={10}
      position={position}
      text={Array.isArray(text) ? text.join('\n') : text}
      textAlign="center"
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      scale={scale}
    >
      <meshPhysicalMaterial
        attach="material"
        color="white"
        opacity={opacity}
        transparent
      />
    </text>
  )
}
