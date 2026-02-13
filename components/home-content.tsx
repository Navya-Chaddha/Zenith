"use client"

import { BlogCard } from "@/components/blog-card"
import { Rocket, Sparkles } from "lucide-react"

interface Blog {
  id: string
  title: string
  excerpt: string | null
  cover_image: string | null
  created_at: string
  read_count: number
  author_id: string
}

interface HomeContentProps {
  blogs: Blog[]
  isAuthor: boolean
  userId?: string
}

export function HomeContent({ blogs, isAuthor, userId }: HomeContentProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      {/* Hero section */}
      <section className="py-8 md:py-12">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Top Stories
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground md:text-5xl text-balance leading-tight">
          Explore the Cosmos
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground md:text-lg">
          Dive into the latest discoveries, missions, and wonders of the universe curated just for you.
        </p>
      </section>

      {/* Blog grid */}
      {blogs.length > 0 ? (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              excerpt={blog.excerpt}
              coverImage={blog.cover_image}
              createdAt={blog.created_at}
              readCount={blog.read_count}
              isAuthor={isAuthor && blog.author_id === userId}
            />
          ))}
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/50 mb-6">
            <Rocket className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No stories yet</h2>
          <p className="text-muted-foreground max-w-sm">
            The universe is vast and stories are waiting to be told. Check back soon for the latest cosmic tales.
          </p>
        </section>
      )}
    </div>
  )
}
