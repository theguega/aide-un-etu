import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";
import type { Profile } from "next-auth";

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
          throw new Error("Compte supprimé ou désactivé");
        }

        return {
          id: profile.id?.toString() || profile.email,
          email: profile.email,
          name: profile.firstName + " " + profile.lastName,
        };
      },
    },
  ],

  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Si c’est une nouvelle connexion (first sign-in)
      if (account && user) {
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
        if (!user.email) {
          console.log("No email found");
          return false;
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          console.log("User not found, redirecting to complete-profile");

          const email = encodeURIComponent(user.email);
          const pseudo = encodeURIComponent(user.name || "");
          return `/complete-profile?mail=${email}&pseudo=${pseudo}`;
        }
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        await prisma.offer.deleteMany({
          where: {
            createdAt: { lt: sixMonthsAgo },
          },
        });

        await prisma.user.update({
          where: { email: user.email },
          data: { lastLogin: new Date() },
        });

        await prisma.user.deleteMany({
          where: {
            lastLogin: { lt: sixMonthsAgo },
          },
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
      console.log(`Auth Debug ${code}:`, metadata);
    },
  },
};

export default NextAuth(authOptions);
