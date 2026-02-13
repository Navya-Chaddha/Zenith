import { Navbar } from "@/components/navbar"
import { StarField } from "@/components/star-field"
import { AboutContent } from "@/components/about-content"

export default function AboutPage() {
  return (
    <div className="min-h-svh">
      <StarField />
      <Navbar />
      <main className="relative z-10 pt-20 pb-24">
        <AboutContent />
      </main>
    </div>
  )
}
