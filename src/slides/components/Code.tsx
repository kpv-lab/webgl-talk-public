import { ReactElement, useEffect } from 'react'
import { COLORS } from '../../assets/colors'
import { FONTS } from '../../assets/fonts'
import { useTypewriter } from '../../lib/use-typewriter'

interface Props {
  castShadow?:    boolean
  delay?:         [number, number]
  position?:      [number, number, number]
  onComplete?:    () => void
  opacity?:       number
  receiveShadow?: boolean
  scale?:         number
  text:           string
  transparent?:   boolean
  link?:          string
}

export function Code(props: Props): ReactElement {
  const {
    delay, text, position = [0, 0, 0], scale = 1, opacity = 1, transparent = false, castShadow, receiveShadow,
    onComplete, link,
  } = props

  const { play, value } = useTypewriter({ text, delay })

  useEffect(() => {
    sequence()

    async function sequence(): Promise<void> {
      await play()
      onComplete?.()
    }
  }, [play])

  return (
    <text
      // eslint-disable-next-line
      // @ts-ignore
      anchorX="center"
      anchorY="middle"
      color={COLORS.TEXT.TITLE}
      font={FONTS.SourceCodePro}
      fontSize={0.3}
      letterSpacing={0}
      lineHeight={1}
      maxWidth={15}
      position={position}
      text={value}
      textAlign="left"
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      scale={scale}
      frustumCulled={false}
      onClick={link ? () => window.open(link, '_blank') : undefined}
    >
      <meshPhysicalMaterial
        attach="material"
        color="white"
        opacity={opacity}
        transparent={transparent}
      />
    </text>
  )
}
