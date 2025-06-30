// src/components/providers/SessionProvider.tsx
"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export function SessionProvider({ children }: Props) {
  return (
    <NextAuthSessionProvider
      refetchInterval={60 * 5} // 5 minutes au lieu de 0 (default)
      refetchOnWindowFocus={false} // Évite les requêtes inutiles
    >
      {children}
    </NextAuthSessionProvider>
  )
}