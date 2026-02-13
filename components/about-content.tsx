"use client"

import { useEffect, useState } from "react"
import { Rocket, Target, Telescope, Orbit, Mail, Globe } from "lucide-react"

const FOUNDER_TEXT = `I've always looked up at the stars and wondered what lies beyond. ZENITH was born from that same childlike curiosity — a desire to make the cosmos accessible, understandable, and deeply fascinating for everyone.

Through ZENITH, I bring you the latest discoveries, deep dives into missions, and stories that make you feel the wonder of space exploration. Every article is written with care, blending scientific accuracy with an engaging narrative.

My mission is simple: to ignite your passion for the universe we call home, and to remind you that we are all made of stardust.`

export function AboutContent() {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const values = [
    {
      icon: Telescope,
      title: "Explore",
      description:
        "Bringing you the latest from the frontiers of space science and astronomy.",
    },
    {
      icon: Target,
      title: "Educate",
      description:
        "Making complex space topics accessible and engaging for all readers.",
    },
    {
      icon: Orbit,
      title: "Inspire",
      description:
        "Fostering a sense of wonder about the cosmos and our place within it.",
    },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-8">
      {/* Header */}
      <section
        className={`py-8 md:py-12 transition-all duration-1000 ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Rocket className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            About the Founder
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground md:text-5xl text-balance leading-tight">
          The Mind Behind ZENITH
        </h1>
      </section>

      {/* Founder section */}
      <section
        className={`rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 md:p-10 mb-10 transition-all duration-1000 delay-300 ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Photo placeholder */}
          <div className="w-full md:w-64 shrink-0">
            <div className="aspect-square rounded-2xl bg-secondary/40 border border-border/40 flex items-center justify-center overflow-hidden">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <div className="h-20 w-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary/60">Z</span>
                </div>
                <span className="text-xs">Founder Photo</span>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">Founder</h2>
            <p className="text-sm text-primary mb-6">Founder & Chief Explorer, ZENITH</p>
            <div className="flex flex-col gap-4">
              {FOUNDER_TEXT.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="text-foreground/80 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                Contact
              </a>
              <a
                href="#"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Globe className="h-4 w-4" />
                Website
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission values */}
      <section
        className={`mb-10 transition-all duration-1000 delay-500 ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h2 className="text-xl font-semibold text-foreground mb-6">Our Mission</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {values.map((v, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mb-4">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1.5">{v.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ZENITH stats */}
      <section
        className={`rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 md:p-8 text-center mb-10 transition-all duration-1000 delay-700 ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-sm text-muted-foreground mb-2">ZENITH</p>
        <p className="text-lg text-foreground/80 max-w-lg mx-auto italic leading-relaxed">
          {"\"The universe is under no obligation to make sense to you. But at ZENITH, we'll do our best to help you make sense of it.\""}
        </p>
      </section>
    </div>
  )
}
