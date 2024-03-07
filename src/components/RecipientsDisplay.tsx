import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

interface RecipientsDisplay {
  recipients: string[]
}

export default function RecipientsDisplay({ recipients }: RecipientsDisplay) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [displayText, setDisplayText] = useState<string>('')
  const [trimmedCount, setTrimmedCount] = useState<number>(0)
  const displayTextRef = useRef<HTMLSpanElement>(null)

  const getTextWidth = useCallback((text: string) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    context.font = getComputedStyle(document.body).font
    return context.measureText(text).width
  }, [])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    function handleResize() {
      if (!displayTextRef.current) {
        return
      }

      let newDisplayText = ''
      let newTrimmedCount = 0
      const computedStyle = getComputedStyle(containerRef.current!)
      let rootWidth = parseInt(computedStyle.width)

      newDisplayText = recipients.join(', ')

      if (rootWidth - getTextWidth(newDisplayText) < 0) {
        newDisplayText = recipients[0] + ', ...'
        newTrimmedCount += recipients.slice(1).length
      }

      setDisplayText(newDisplayText)
      setTrimmedCount(newTrimmedCount)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Container ref={containerRef}>
      <DisplayText ref={displayTextRef}>{displayText}</DisplayText>
      {!!trimmedCount && <Badge>+{trimmedCount}</Badge>}
    </Container>
  )
}

const Badge = styled('div')`
  font-size: 16px;
  color: #f0f0f0;
  background-color: #666666;
  border-radius: 3px;
  padding: 2px 5px;
`

const Container = styled('div')`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`

const DisplayText = styled('span')`
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  justify-content: space-between;
`
