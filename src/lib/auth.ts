import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import type { Profile } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "custom-provider",
      name: "Connexion Étudiante",
      credentials: {
        email: { 
          label: "Email", 
          type: "email", 
          placeholder: "ton-email@exemple.com" 
        },
        password: { 
          label: "Mot de passe", 
          type: "password" 
        }
      },
      async authorize(credentials) {
        // Mode développement : bypass complet
        if (process.env.NODE_ENV === 'development') {
          // Option 1: Utiliser un utilisateur fixe de ta DB
          const user = await prisma.user.findUnique({
            where: { id: "cmckfy1wy0000i0x5f7mfwx02" },
          });
          
          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.pseudo,
            };
          }
          
          // Option 2: Créer un utilisateur temporaire si pas trouvé
          return {
            id: "dev-user-123",
            email: credentials?.email || "dev@example.com",
            name: "Dev User",
          };
        }
        
        // En production, tu peux laisser ça pour sécurité
        return null;
      },
    }),
    
    // Version simplifiée pour bypass complet (optionnel)
    CredentialsProvider({
      id: "dev-bypass",
      name: "Dev Bypass",
      credentials: {},
      async authorize() {
        // Bypass total - retourne toujours le même user
        if (process.env.NODE_ENV === 'development') {
          return {
            id: "cmckfy1wy0000i0x5f7mfwx02",
            email: "mathis.delmaere@etu.utc.fr",
            name: "Mathis Delmaere",
          };
        }
        return null;
      },
    })
  ],
  
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account && user) {
        // En mode dev, on peut bypasser la vérification DB
        if (process.env.NODE_ENV === 'development') {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
        } else {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });
          if (dbUser) {
            token.id = dbUser.id.toString();
            token.name = dbUser.pseudo;
            token.email = dbUser.email;
          } else {
            token.email = (profile as Profile | undefined)?.email;
            token.name = (profile as Profile | undefined)?.name;
            token.id = user?.id;
          }
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...(session.user || {}),
          email: token.email as string,
          name: token.name as string,
          id: token.id as string,
        };
      }
      return session;
    },
    
    async signIn({ user }) {
      try {
        // Bypass complet en développement
        if (process.env.NODE_ENV === 'development') {
          console.log('🚀 Mode développement - bypass activé');
          return true;
        }
        
        if (!user.email) return false;
        
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        
        if (!existingUser) {
          const email = encodeURIComponent(user.email);
          const pseudo = encodeURIComponent(user.name || "");
          return `/complete-profile?mail=${email}&pseudo=${pseudo}`;
        }
        
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        await prisma.offer.deleteMany({
          where: { createdAt: { lt: sixMonthsAgo } },
        });
        
        await prisma.user.update({
          where: { email: user.email },
          data: { lastLogin: new Date() },
        });
        
        await prisma.user.deleteMany({
          where: { lastLogin: { lt: sixMonthsAgo } },
        });
        
        return true;
      } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return false;
      }
    },
  },
  
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  
  jwt: {
    maxAge: 60 * 60,
  },
  
  logger: {
    error: (code, metadata) => {
      console.error(`Auth Error ${code}:`, metadata);
    },
    warn: (code) => {
      console.warn(`Auth Warning ${code}`);
    },
    debug: (code, metadata) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Auth Debug ${code}:`, metadata);
      }
    },
  },
};

export default NextAuth(authOptions);