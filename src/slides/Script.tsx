import { createContext, Dispatch, ReactElement, SetStateAction, useContext, useState } from 'react'

const Context = createContext<Dispatch<SetStateAction<string | string[]>>>(null as any as Dispatch<SetStateAction<string | string[]>>)

interface Props {
  children: ReactElement | ReactElement[]
}

export function Script(props: Props): ReactElement {
  const { children } = props

  const [hidden, setHidden] = useState(false)
  const [text, setText] = useState<string | string[]>('')

  return (
    <Context.Provider value={setText}>
      { children }
      <div
        className={`script ${hidden ? 'hidden' : ''}`}
        onClick={() => setHidden(h => !h)}
      >
        {
          hidden
            ? <TextAlignLeftIcon />
            : (Array.isArray(text) ? text.map((t, i) => <p key={i}>{t}</p>) : <p>{ text }</p>)
        }
      </div>
    </Context.Provider>
  )
}

export function useScript(text: string | string[] | undefined): void {
  const setText = useContext<Dispatch<SetStateAction<string | string[]>>>(Context)!
  setText(text ?? '')
}

function TextAlignLeftIcon(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="#fff"
      opacity="0.5"
      viewBox="0 0 256 256"
    >
      <path d="M32,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H40A8,8,0,0,1,32,64Zm8,48H168a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm176,24H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm-48,40H40a8,8,0,0,0,0,16H168a8,8,0,0,0,0-16Z" />
    </svg>
  )
}
