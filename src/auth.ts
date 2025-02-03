import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { env } from "./env"
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                password: {},
            },
            authorize: async (credentails) => {
                const { password } = credentails
                if (password === env.AUTH_TOKEN) {
                    return {
                        id: "1",
                        name: "Quadrical",
                        email: "quadrical@gmail.com",
                        image: "https://avatars.githubusercontent.com/u/10199126?v=4",
                        role: "admin",
                    }
                }
                return null
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth
        },
    },
})
