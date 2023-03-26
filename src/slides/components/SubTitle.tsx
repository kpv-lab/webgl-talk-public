import { ReactElement } from 'react'
import { COLORS } from '../../assets/colors'
import { FONTS } from '../../assets/fonts'

interface Props {
  castShadow?:    boolean
  position?:      [number, number, number]
  receiveShadow?: boolean
  text:           string
  opacity?:       number
  scale?:         number
  textAlign?:     'left' | 'right' | 'center' | 'justify'
  link?:          string
}

export function SubTitle(props: Props): ReactElement {
  const {
    text, position = [0, 0, 0], castShadow, opacity = 1, receiveShadow, scale = 1, textAlign = 'justify', link,
  } = props

  return (
    <text
      // eslint-disable-next-line
      // @ts-ignore
      position={position}
      scale={scale}
      fontSize={0.4}
      color={COLORS.TEXT.MAIN}
      maxWidth={300}
      lineHeight={1}
      letterSpacing={0}
      textAlign={textAlign}
      text={text}
      font={FONTS.RobotoSlab}
      anchorX="center"
      anchorY="middle"
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      frustumCulled={false}
      onClick={link ? () => window.open(link, '_blank') : undefined}
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
