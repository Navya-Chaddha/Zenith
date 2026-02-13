"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Calendar,
  Eye,
  Volume2,
  VolumeX,
  Languages,
  ArrowLeft,
  Highlighter,
  Bot,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TextSelectionPopover } from "@/components/text-selection-popover"
import { YuriChat } from "@/components/yuri-chat"

interface BlogData {
  id: string
  title: string
  content: string
  excerpt: string | null
  coverImage: string | null
  createdAt: string
  readCount: number
}

interface BlogReaderProps {
  blog: BlogData
  isAuthor: boolean
}

export function BlogReader({ blog, isAuthor }: BlogReaderProps) {
  const [animatedParagraphs, setAnimatedParagraphs] = useState<Set<number>>(new Set())
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechLang, setSpeechLang] = useState<"en" | "hi">("en")
  const [yuriOpen, setYuriOpen] = useState(false)
  const [yuriContext, setYuriContext] = useState("")
  const [highlights, setHighlights] = useState<string[]>([])
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([])

  const paragraphs = blog.content.split("\n").filter((p) => p.trim())

  const date = new Date(blog.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Intersection observer for animated text reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"))
            setAnimatedParagraphs((prev) => new Set(prev).add(index))
          }
        })
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    )

    paragraphRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [paragraphs.length])

  // Text-to-speech
  const speak = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const text = blog.content
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = speechLang === "hi" ? "hi-IN" : "en-US"
    utterance.rate = 0.9
    utterance.pitch = 1

    // Try to find appropriate voice
    const voices = window.speechSynthesis.getVoices()
    const langCode = speechLang === "hi" ? "hi" : "en"
    const voice = voices.find((v) => v.lang.startsWith(langCode))
    if (voice) utterance.voice = voice

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }, [blog.content, isSpeaking, speechLang])

  // Stop speech when lang changes
  useEffect(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [speechLang])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const handleAskYuri = (text: string) => {
    setYuriContext(text)
    setYuriOpen(true)
  }

  const handleHighlight = (text: string) => {
    setHighlights((prev) => [...prev, text])
  }

  const renderParagraph = (text: string, index: number) => {
    let rendered: React.ReactNode = text

    // Highlight matching text segments
    if (highlights.length > 0) {
      const parts: React.ReactNode[] = []
      let remaining = text
      let keyCounter = 0

      for (const highlight of highlights) {
        const idx = remaining.toLowerCase().indexOf(highlight.toLowerCase())
        if (idx !== -1) {
          if (idx > 0) {
            parts.push(remaining.slice(0, idx))
          }
          parts.push(
            <mark
              key={`hl-${keyCounter++}`}
              className="bg-primary/20 text-foreground rounded px-0.5"
            >
              {remaining.slice(idx, idx + highlight.length)}
            </mark>
          )
          remaining = remaining.slice(idx + highlight.length)
        }
      }
      if (parts.length > 0) {
        parts.push(remaining)
        rendered = parts
      }
    }

    return rendered
  }

  return (
    <div className="mx-auto max-w-3xl px-4 lg:px-8">
      {/* Back button */}
      <Link
        href="/home"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to stories
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl text-balance leading-tight">
          {blog.title}
        </h1>
        {blog.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground">{blog.excerpt}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {date}
          </span>
          {isAuthor && (
            <span className="flex items-center gap-1.5 text-sm text-primary/70">
              <Eye className="h-4 w-4" />
              {blog.readCount} {blog.readCount === 1 ? "reader" : "readers"}
            </span>
          )}
        </div>

        {/* Controls bar */}
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-3">
          {/* Language toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSpeechLang(speechLang === "en" ? "hi" : "en")}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <Languages className="h-4 w-4" />
            <span className="text-xs font-medium">{speechLang === "en" ? "English" : "Hindi"}</span>
          </Button>

          {/* TTS button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={speak}
            className={`gap-2 ${
              isSpeaking
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
            <span className="text-xs font-medium">
              {isSpeaking ? "Stop" : "Listen"}
            </span>
          </Button>

          <div className="mx-auto" />

          {/* Yuri AI button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setYuriContext("")
              setYuriOpen(!yuriOpen)
            }}
            className={`gap-2 ${
              yuriOpen
                ? "text-accent bg-accent/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bot className="h-4 w-4" />
            <span className="text-xs font-medium">Ask Yuri</span>
          </Button>
        </div>
      </header>

      {/* Cover image */}
      {blog.coverImage && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-border/40">
          <img
            src={blog.coverImage}
            alt={`Cover for ${blog.title}`}
            className="w-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Article body with animated paragraphs */}
      <TextSelectionPopover onAskYuri={handleAskYuri} onHighlight={handleHighlight}>
        <article className="prose-space">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              ref={(el) => { paragraphRefs.current[i] = el }}
              data-index={i}
              className={`text-foreground/85 leading-relaxed text-base md:text-lg mb-6 transition-all duration-700 ${
                animatedParagraphs.has(i)
                  ? "opacity-100 translate-y-0 blur-0"
                  : "opacity-0 translate-y-4 blur-[2px]"
              }`}
            >
              {renderParagraph(p, i)}
            </p>
          ))}
        </article>
      </TextSelectionPopover>

      {/* Highlights summary */}
      {highlights.length > 0 && (
        <div className="mt-10 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Highlighter className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Your Highlights</span>
          </div>
          <div className="flex flex-col gap-2">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="text-sm text-foreground/70 bg-secondary/40 rounded-lg px-3 py-2 border-l-2 border-primary/40"
              >
                {h}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Yuri Chatbot */}
      <YuriChat
        open={yuriOpen}
        onClose={() => setYuriOpen(false)}
        initialContext={yuriContext}
        blogTitle={blog.title}
      />
    </div>
  )
}
