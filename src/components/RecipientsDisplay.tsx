import { useCallback, useEffect, useRef, useState } from 'react'

interface RecipientsDisplay {
  recipients: string[]
}

export default function RecipientsDisplay({
  recipients: propsRecipients,
}: RecipientsDisplay) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [recipients, setRecipinets] = useState<string[]>(propsRecipients)

  const getTextWidth = useCallback((text: string) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    // Get font from body
    context.font = getComputedStyle(document.body).font
    return context.measureText(text).width
  }, [])

  useEffect(() => {
    console.log(rootRef.current!.clientWidth);

    function handleResize() {}

    document.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div ref={rootRef}>
      {recipients.map(recipinet => (
        <div>{recipinet}</div>
      ))}
    </div>
  )
}
