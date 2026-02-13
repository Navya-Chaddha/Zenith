import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Rocket } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-10">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">Check your email</h2>
          <p className="text-sm text-muted-foreground mb-3">
            {"We've sent you a confirmation link. Please check your inbox (and spam folder) and click the link to verify your email."}
          </p>
          <p className="text-xs text-muted-foreground/70 mb-6">
            {"If you don't receive the email within a few minutes, go back to login and try signing in -- some Supabase configurations allow immediate access."}
          </p>
          <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/auth/login">
              <Rocket className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
