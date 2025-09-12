"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export default function AuthCallback() {
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

      // Call backend here
      try {
        const res = await fetch("http://localhost:4000/api/auth/oauth-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: sessionUser.email,
            name: sessionUser.user_metadata.full_name,
            provider: sessionUser.app_metadata.provider,
            external_id: sessionUser.id,
          }),
        })
        const result = await res.json()
        console.log("Saved user:", result)
      } catch (err) {
        console.error(err)
      }
    }
  }

  fetchSession()

  // Optional: listen to auth state changes
  const { data: listenerData } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) setUser(session.user)
  })
  const { subscription } = listenerData
  return () => subscription.unsubscribe()
}, [])
console.log(user);

  

  if (!user) return <p>Loading...</p>

  return (
    <div>
      <h1>Welcome {user.email}</h1>
      <p>Provider: {user.app_metadata.provider}</p>
    </div>
  )
}
