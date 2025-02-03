"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(pin: string) {
    try {
        await signIn("credentials", {
            password: pin,
            redirect: false, // Disable automatic redirect
        })
        return { success: true }
    } catch (error) {
        if (error instanceof AuthError) {
            return { success: false, error: "Invalid credentials" }
        }
        throw error
    }
}
