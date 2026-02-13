"use client"

import Link from "next/link"
import { Calendar, Eye, ArrowRight } from "lucide-react"

interface BlogCardProps {
  id: string
  title: string
  excerpt: string | null
  coverImage: string | null
  createdAt: string
  readCount: number
  isAuthor?: boolean
}

export function BlogCard({
  id,
  title,
  excerpt,
  coverImage,
  createdAt,
  readCount,
  isAuthor,
}: BlogCardProps) {
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Link href={`/blog/${id}`} className="group block">
      <article className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5">
        {/* Cover image area */}
        {coverImage ? (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={coverImage}
              alt={`Cover for ${title}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              crossOrigin="anonymous"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-secondary/30 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary/60">{title.charAt(0)}</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2 text-balance group-hover:text-primary transition-colors">
            {title}
          </h3>
          {excerpt && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {excerpt}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {date}
              </span>
              {isAuthor && (
                <span className="flex items-center gap-1 text-primary/70">
                  <Eye className="h-3.5 w-3.5" />
                  {readCount} {readCount === 1 ? "read" : "reads"}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Read
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
