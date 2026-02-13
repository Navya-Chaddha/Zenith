"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { X, Send, Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface YuriChatProps {
  open: boolean
  onClose: () => void
  initialContext: string
  blogTitle: string
}

export function YuriChat({ open, onClose, initialContext, blogTitle }: YuriChatProps) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sentContextRef = useRef(false)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/yuri",
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          id,
          messages,
          blogTitle,
        },
      }),
    }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // Send initial context when provided and chat is opened
  useEffect(() => {
    if (open && initialContext && !sentContextRef.current) {
      sentContextRef.current = true
      sendMessage({
        text: `Help me understand this text from the article "${blogTitle}": "${initialContext}"`,
      })
    }
    if (!open) {
      sentContextRef.current = false
    }
  }, [open, initialContext, blogTitle, sendMessage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  if (!open) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-md sm:bottom-6 sm:right-6">
      <div className="flex h-[500px] max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl shadow-background/80">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 border border-accent/25">
              <Bot className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Yuri</h3>
              <p className="text-[10px] text-muted-foreground">Space Knowledge Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Close Yuri chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 mb-4">
                <Sparkles className="h-7 w-7 text-accent" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                {"Hey, I'm Yuri!"}
              </p>
              <p className="text-xs text-muted-foreground max-w-[240px]">
                Your space knowledge companion. Ask me anything about this article or space in general.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex gap-2.5 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  message.role === "user"
                    ? "bg-primary/15 border border-primary/25"
                    : "bg-accent/15 border border-accent/25"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Bot className="h-3.5 w-3.5 text-accent" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-primary/15 text-foreground border border-primary/20"
                    : "bg-secondary/60 text-foreground/90 border border-border/40"
                }`}
              >
                {message.parts.map((part, idx) => {
                  if (part.type === "text") {
                    return <span key={idx}>{part.text}</span>
                  }
                  return null
                })}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="mb-4 flex gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/15 border border-accent/25">
                <Bot className="h-3.5 w-3.5 text-accent" />
              </div>
              <div className="rounded-xl bg-secondary/60 border border-border/40 px-3.5 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-border/50 px-3 py-3"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Yuri anything..."
              disabled={isLoading}
              className="flex-1 rounded-xl bg-secondary/50 border border-border/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 disabled:opacity-50"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 rounded-xl bg-accent text-accent-foreground hover:bg-accent/80 p-0 shrink-0"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
