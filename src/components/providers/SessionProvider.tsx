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
      refetchInterval={60 * 5}
      refetchOnWindowFocus={false}
    >
      {children}
    </NextAuthSessionProvider>
  )
}