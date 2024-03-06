import { useCallback, useEffect, useRef, useState } from 'react'

interface RecipientsDisplay {
  recipients: string[]
}

type StyleRecord = { [key: string]: React.CSSProperties }

export default function RecipientsDisplay({ recipients }: RecipientsDisplay) {
  const rootRef = useRef<HTMLDivElement>(null)
  // const [recipients, setRecipinets] = useState<string[]>(propsRecipients)
  const [displayText, setDisplayText] = useState<string>('')
  const [trimmedCount, setTrimmedCount] = useState<number>(0)
  const styles: StyleRecord = {
    root: {
      display: 'flex',
      width: 'inherit',
      overflow: 'hidden',
      justifyContent: 'space-between',
    },
    badge: {
      fontSize: '16px',
      color: '#f0f0f0',
      backgroundColor: '#666666',
      borderRadius: '3px',
      padding: '2px 5px',
    },
  }

  const getTextWidth = useCallback((text: string) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    // Get font from body
    context.font = getComputedStyle(document.body).font
    return context.measureText(text).width
  }, [])

  useEffect(() => {
    if (!rootRef.current) {
      return
    }

    // const remainWidth = getTextWidth()
    // let remainLength = recipients.length
    //
    // while (remainLength) {
    //   remainLength--
    // }

    function handleResize() {
      const labels: string[] = []

      const computedStyle = getComputedStyle(rootRef.current!)

      // Width with padding
      let remainLength = parseInt(computedStyle.width);
      let newTrimmedCount = 0;

      for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i]
        remainLength -= getTextWidth(recipient)

        if (remainLength > 0) {
          labels.push(recipient)
        } else {
          newTrimmedCount++;
        }
      }

      setDisplayText(labels.join(','))
      setTrimmedCount(newTrimmedCount)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div ref={rootRef} style={styles.root}>
      <span>{displayText}</span>
      {!!trimmedCount && <div style={styles.badge} }>+{trimmedCount}</div>}
    </div>
  )
}
