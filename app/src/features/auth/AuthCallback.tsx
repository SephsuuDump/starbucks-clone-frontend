"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { AuthService } from "@/services/authService"
import { toast } from "sonner"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export function AuthCallbackPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
  async function fetchSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error(error)
      return
    }

    const sessionUser = data?.session?.user
    if (sessionUser) {
      setUser(sessionUser)

      console.log('User valid:', sessionUser)

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: sessionUser.email,
            name: sessionUser.user_metadata.full_name,
            provider: sessionUser.app_metadata.provider,
            external_id: sessionUser.id,
          }),
        })
        const result = await res.json();
        if (result) {
            await AuthService.setCookies(result);
            const c = await AuthService.getCookies();
            toast.success(`${c}`)
            window.location.href = '/';
        }  
      } catch (err) {
        console.error(err)
      }
    }
  }

  fetchSession()

  }, [])  

  return (
    <div>
     
    </div>
  )
}
