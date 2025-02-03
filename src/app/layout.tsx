import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Image from "next/image"
import "./globals.css"
import Providers from "./providers"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Thermostat Manager",
    description: "Thermostat Manager",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Providers>
                    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-2 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                        <main className="flex flex-col gap-8 row-start-2 items-center">
                            <Image
                                src="/logo.png"
                                alt="Thermostat Logo"
                                width={120}
                                height={40}
                                className="h-10 w-auto"
                                priority
                            />
                            {children}
                        </main>
                        <Toaster />
                    </div>
                </Providers>
            </body>
        </html>
    )
}
