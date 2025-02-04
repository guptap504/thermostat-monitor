"use server"

import { AuthError } from "next-auth"
import { signIn } from "@/auth"

export async function authenticate(pin: string) {
    try {
        await signIn("credentials", {
            password: pin,
            redirect: false, // Disable automatic redirect
        })
        return { success: true, error: null }
    } catch (error) {
        if (error instanceof AuthError) {
            return { success: false, error: "Invalid credentials" }
        }
        throw error
    }
}
