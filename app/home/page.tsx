import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { StarField } from "@/components/star-field"
import { HomeContent } from "@/components/home-content"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  const isAuthor = !!user

  return (
    <div className="min-h-svh">
      <StarField />
      <Navbar />
      <main className="relative z-10 pt-20 pb-24">
        <HomeContent blogs={blogs || []} isAuthor={isAuthor} userId={user?.id} />
      </main>
    </div>
  )
}
