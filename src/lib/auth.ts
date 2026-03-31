import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ALLOWED_DOMAIN = "seniorsource.io";
          if (!user.email.endsWith(`@${ALLOWED_DOMAIN}`)) {
            return false;
          }
          return { data: user };
        },
      },
    },
  },
  plugins: [nextCookies()],
});
