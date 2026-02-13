"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { Highlighter, Bot } from "lucide-react"

interface TextSelectionPopoverProps {
  children: ReactNode
  onAskYuri: (text: string) => void
  onHighlight: (text: string) => void
}

export function TextSelectionPopover({
  children,
  onAskYuri,
  onHighlight,
}: TextSelectionPopoverProps) {
  const [selectedText, setSelectedText] = useState("")
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      const text = selection.toString().trim()
      if (text.length < 3) {
        setVisible(false)
        return
      }

      // Check if selection is within our container
      const range = selection.getRangeAt(0)
      if (!containerRef.current?.contains(range.commonAncestorContainer)) {
        setVisible(false)
        return
      }

      const rect = range.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()

      setSelectedText(text)
      setPosition({
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top - containerRect.top - 10,
      })
      setVisible(true)
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (popoverRef.current?.contains(e.target as Node)) return
      setVisible(false)
    }

    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mousedown", handleMouseDown)

    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousedown", handleMouseDown)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {children}

      {visible && selectedText && (
        <div
          ref={popoverRef}
          className="absolute z-50 flex items-center gap-1 rounded-xl border border-border/60 bg-card/95 backdrop-blur-xl p-1.5 shadow-xl shadow-background/50"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <button
            onClick={() => {
              onHighlight(selectedText)
              setVisible(false)
              window.getSelection()?.removeAllRanges()
            }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors"
            aria-label="Highlight selected text"
          >
            <Highlighter className="h-3.5 w-3.5" />
            Highlight
          </button>
          <div className="h-5 w-px bg-border/60" />
          <button
            onClick={() => {
              onAskYuri(selectedText)
              setVisible(false)
              window.getSelection()?.removeAllRanges()
            }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground/80 hover:bg-accent/10 hover:text-accent transition-colors"
            aria-label="Ask Yuri AI about selected text"
          >
            <Bot className="h-3.5 w-3.5" />
            Ask Yuri
          </button>
        </div>
      )}
    </div>
  )
}
