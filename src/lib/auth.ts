// src/lib/auth.ts
import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import { prisma } from "./prisma"

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
    }
  ],
  
  callbacks: {
    async jwt({ token, account, profile, user }) {
      console.log("JWT CALLBACK CALLED", { token, account, profile, user });
      
      if (account && profile) {
        token.email = (profile as any).email;
        token.name = (profile as any).name;
        token.id = (profile as any).id;
        console.log("JWT CALLBACK PROFILE", profile);
      }
      
      return token
    },
    
    async session({ session, token }) {
      console.log("SESSION CALLBACK CALLED", { session, token });
      
      if (token) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.id = token.id as string;
      }
      
      console.log("SESSION CALLBACK RESULT", session);
      return session
    },
    
    async signIn({ user, account, profile }) {
      console.log("SIGNIN CALLBACK CALLED", { user, account, profile })

      try {
        if (!user.email) {
          console.log("No email found")
          return false
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })

        if (!existingUser) {
          console.log("User not found, redirecting to complete-profile")

          const email = encodeURIComponent(user.email)
          const pseudo = encodeURIComponent(user.name || "")
          return `/complete-profile?mail=${email}&pseudo=${pseudo}`
        }

        console.log("User found, allowing sign in")
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
  
  // Activer le debug pour voir les logs
  debug: process.env.NODE_ENV === "development",
  
  logger: {
    error: (code, metadata) => {
      console.error(`Auth Error ${code}:`, metadata)
    },
    warn: (code) => {
      console.warn(`Auth Warning ${code}`)
    },
    debug: (code, metadata) => {
      console.log(`Auth Debug ${code}:`, metadata)
    }
  }
}

export default NextAuth(authOptions)