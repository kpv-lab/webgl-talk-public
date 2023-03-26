import { ReactElement } from 'react'
import { COLORS } from '../../assets/colors'
import { FONTS } from '../../assets/fonts'

interface Props {
  castShadow?: boolean
  offset?:     number
  text:        string
}

export function TextBlock(props: Props): ReactElement {
  const { text, offset = 0, castShadow } = props

  return (
    <text
      // eslint-disable-next-line
      // @ts-ignore
      position={[0,offset,0]}
      fontSize={0.4}
      color={COLORS.TEXT.MAIN}
      maxWidth={10}
      lineHeight={1}
      letterSpacing={0}
      textAlign="center"
      text={text}
      font={FONTS.RobotoSlab}
      anchorX="center"
      anchorY="middle"
      castShadow={castShadow}
    >
      <meshPhysicalMaterial attach="material" color="white" />
    </text>
  )
}
