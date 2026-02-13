"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  PenLine,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  X,
  Save,
  BarChart3,
  FileText,
} from "lucide-react"

interface Blog {
  id: string
  title: string
  excerpt: string | null
  content: string
  cover_image: string | null
  published: boolean
  read_count: number
  created_at: string
}

interface AuthorDashboardProps {
  blogs: Blog[]
  userId: string
}

export function AuthorDashboard({ blogs, userId }: AuthorDashboardProps) {
  const [showEditor, setShowEditor] = useState(false)
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const totalReads = blogs.reduce((acc, b) => acc + b.read_count, 0)
  const publishedCount = blogs.filter((b) => b.published).length

  const handleCreate = async (publish: boolean) => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }

    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()
    const { error: insertError } = await supabase.from("blogs").insert({
      title: title.trim(),
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      cover_image: coverImage.trim() || null,
      author_id: userId,
      published: publish,
    })

    if (insertError) {
      setError(insertError.message)
      setIsSubmitting(false)
      return
    }

    setTitle("")
    setExcerpt("")
    setContent("")
    setCoverImage("")
    setShowEditor(false)
    setIsSubmitting(false)
    router.refresh()
  }

  const handleTogglePublish = async (blogId: string, currentState: boolean) => {
    const supabase = createClient()
    await supabase
      .from("blogs")
      .update({ published: !currentState })
      .eq("id", blogId)
    router.refresh()
  }

  const handleDelete = async (blogId: string) => {
    const supabase = createClient()
    await supabase.from("blogs").delete().eq("id", blogId)
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-8">
      {/* Header */}
      <section className="py-8 md:py-12">
        <div className="flex items-center gap-2 mb-3">
          <PenLine className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Author Dashboard
          </span>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Your Stories
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create, manage, and track your cosmic tales.
            </p>
          </div>
          <Button
            onClick={() => setShowEditor(!showEditor)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            {showEditor ? (
              <>
                <X className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                New Story
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-medium">Total</span>
          </div>
          <span className="text-2xl font-bold text-foreground">{blogs.length}</span>
        </div>
        <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <Eye className="h-4 w-4" />
            <span className="text-xs font-medium">Published</span>
          </div>
          <span className="text-2xl font-bold text-foreground">{publishedCount}</span>
        </div>
        <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs font-medium">Reads</span>
          </div>
          <span className="text-2xl font-bold text-foreground">{totalReads}</span>
        </div>
      </section>

      {/* Editor */}
      {showEditor && (
        <section className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 md:p-8 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-5">Create New Story</h2>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title" className="text-foreground/80">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Next Giant Leap..."
                className="bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="excerpt" className="text-foreground/80">
                Excerpt <span className="text-muted-foreground/50">(optional)</span>
              </Label>
              <Input
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary of the story..."
                className="bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cover" className="text-foreground/80">
                Cover Image URL <span className="text-muted-foreground/50">(optional)</span>
              </Label>
              <Input
                id="cover"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="content" className="text-foreground/80">
                Content
                <span className="text-muted-foreground/50 text-xs ml-2">
                  (use blank lines to separate paragraphs)
                </span>
              </Label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your cosmic story here..."
                rows={12}
                className="w-full rounded-lg bg-secondary/50 border border-border/60 text-foreground placeholder:text-muted-foreground/50 px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-y"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="ghost"
                onClick={() => handleCreate(false)}
                disabled={isSubmitting}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleCreate(true)}
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Publishing...
                  </span>
                ) : (
                  <>
                    <PenLine className="h-4 w-4" />
                    Publish
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Blog list */}
      <section className="flex flex-col gap-3">
        {blogs.length === 0 && !showEditor ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50 mb-4">
              <PenLine className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No stories yet</h3>
            <p className="text-sm text-muted-foreground">
              Click "New Story" to write your first cosmic tale.
            </p>
          </div>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog.id}
              className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm p-4 sm:flex-row sm:items-center sm:justify-between hover:border-border/80 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {blog.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      blog.published
                        ? "bg-primary/15 text-primary border border-primary/20"
                        : "bg-secondary text-muted-foreground border border-border/40"
                    }`}
                  >
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {blog.read_count} reads
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTogglePublish(blog.id, blog.published)}
                  className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  {blog.published ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      Publish
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(blog.id)}
                  className="h-8 gap-1.5 text-xs text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
