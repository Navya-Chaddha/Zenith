import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { StarField } from "@/components/star-field"
import { AuthorDashboard } from "@/components/author-dashboard"

export default async function AuthorPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // V1: Founder is the sole author — show all blogs
  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-svh">
      <StarField />
      <Navbar />
      <main className="relative z-10 pt-20 pb-24">
        <AuthorDashboard blogs={blogs || []} userId={user.id} />
      </main>
    </div>
  )
}
