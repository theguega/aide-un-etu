// src/lib/auth.ts
import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"

// Configuration du provider personnalisé
export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "custom-provider",
      name: "Connexion Étudiante",
      type: "oauth",
      clientId: process.env.MY_CLIENT_ID!,
      clientSecret: process.env.MY_CLIENT_SECRET!,
      authorization: {
        url: process.env.OAUTH_AUTHORIZATION_URL!,
        params: {
          scope: process.env.OAUTH_SCOPES!,
          response_type: "code",
        },
      },
      token: {
        url: process.env.OAUTH_ACCESS_TOKEN_URL!,
      },
      userinfo: {
        url: process.env.OAUTH_RESOURCE_OWNER_DETAILS_URL!,
      },
      profile(profile) {
        if (profile.deleted_at != null || profile.active != 1) {
          throw new Error("Compte supprimé ou désactivé")
        }

        return {
          id: profile.id?.toString() || profile.email,
          email: profile.email,
          name: profile.firstName + " " + profile.lastName,
        }
      },
      style: {
        //logo: "/logo-etudiant.svg", 
        //logoDark: "/logo-etudiant-dark.svg",
        bg: "#3B82F6",
        text: "#FFFFFF",
        bgDark: "#1E40AF",
        textDark: "#FFFFFF"
      }
    }
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.provider = (profile as any).provider
        token.alumniOrExte = (profile as any).provider !== "cas"
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user.provider = token.provider as string
      session.user.alumniOrExte = token.alumniOrExte as boolean
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          return false
        }
        
        return true
      } catch (error) {
        console.error("Erreur lors de la connexion:", error)
        return false
      }
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60, 
  },
  /*debug: process.env.NODE_ENV === "development",
  logger: {
    error: (code, metadata) => {
      // Log minimal pour réduire l'impact
      console.error(`Auth Error ${code}:`, metadata)
    },
  },*/
}

export default NextAuth(authOptions)