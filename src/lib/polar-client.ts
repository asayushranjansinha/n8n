import { Polar } from "@polar-sh/sdk";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  // server: process.env.NODE_ENV === "production" ? "production" : "sandbox", to be added once client completes setup for payouts
  server: "sandbox",
});
export { polarClient };
