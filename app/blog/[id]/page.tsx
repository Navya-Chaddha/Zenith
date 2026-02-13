import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { StarField } from "@/components/star-field"
import { BlogReader } from "@/components/blog-reader"

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single()

  if (!blog) {
    notFound()
  }

  // Track read if user is logged in
  if (user) {
    await supabase.from("blog_reads").upsert(
      { blog_id: id, user_id: user.id },
      { onConflict: "blog_id,user_id" }
    )

    // Update read count
    const { count } = await supabase
      .from("blog_reads")
      .select("*", { count: "exact", head: true })
      .eq("blog_id", id)

    if (count !== null) {
      await supabase
        .from("blogs")
        .update({ read_count: count })
        .eq("id", id)
    }
  }

  // V1: Founder is the sole author — any logged-in user is the author
  const isAuthor = !!user

  return (
    <div className="min-h-svh">
      <StarField />
      <Navbar />
      <main className="relative z-10 pt-20 pb-24">
        <BlogReader
          blog={{
            id: blog.id,
            title: blog.title,
            content: blog.content,
            excerpt: blog.excerpt,
            coverImage: blog.cover_image,
            createdAt: blog.created_at,
            readCount: blog.read_count,
          }}
          isAuthor={isAuthor}
        />
      </main>
    </div>
  )
}
