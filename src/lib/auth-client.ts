import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if using the same domain) */
    baseURL: "http://localhost:3000"
})