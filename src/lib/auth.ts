import { checkout, polar, portal, usage } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "./database";
import { polarClient } from "./polar-client";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            // COMMUNITY PLAN (Free/Non-checkout, but included for completeness if needed)
            {
              productId: process.env.NEXT_PUBLIC_POLAR_COMMUNITY as string,
              slug: "community",
            },
            // PRO PLAN (Required for the pricing section)
            {
              productId: process.env.NEXT_PUBLIC_POLAR_PRO as string,
              slug: "pro",
            },
            // ENTERPRISE PLAN (Required for the pricing section)
            {
              productId: process.env.NEXT_PUBLIC_POLAR_ENTERPRISE as string,
              slug: "enterprise",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
      ],
    }),
  ],
});
