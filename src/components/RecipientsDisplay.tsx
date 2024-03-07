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

  /**
   * Compute the width (in pixels) of the given text using an HTML5 canvas context.
   * This is an appropriate util for determining width of a text with draw that on the canvas.
   *
   * @param {string} text - The text whose width needs to be measured.
   * @returns {number} The width of the text in pixels.
   */
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

    /**
     * This function serves as a handler, not only for the resize event but also during the initial mounting phase.
     * Its purpose is to determine which part of emails should be displayed or trimmed. Additionally, it calculates
     * the count of emails to be shown and displays that count inside a badge.
     */
    function handleEmailDisplay() {
      if (!displayTextRef.current) {
        return
      }

      let newDisplayText = ''
      let newTrimmedCount = 0

      // Get the computed style for the container element and parse that to number
      const computedStyle = getComputedStyle(containerRef.current!)
      let containerWidth = parseInt(computedStyle.width)

      // Join all emails together to display in a row or trimmed them into an email and other count in a badge.
      newDisplayText = recipients.join(', ')

      /**
       * This code handles email display logic.
       * If the available width within the container is insufficient to show the entire email text,
       * it displays the remaining emails count inside a badge.
       */
      if (containerWidth - getTextWidth(newDisplayText) < 0) {
        newDisplayText = recipients[0] + ', ...'
        newTrimmedCount += recipients.slice(1).length
      }

      setDisplayText(newDisplayText)
      setTrimmedCount(newTrimmedCount)
    }

    handleEmailDisplay()

    window.addEventListener('resize', handleEmailDisplay)

    return () => {
      window.removeEventListener('resize', handleEmailDisplay)
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
