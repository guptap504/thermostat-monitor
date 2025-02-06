/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { env } from "@/env"

class RequestQueue {
    private queue: Array<{
        request: NextRequest
        resolve: (value: Response) => void
        reject: (reason?: any) => void
    }> = []
    private isProcessing = false
    private cache = new Map<string, { data: any; timestamp: number }>()
    private CACHE_DURATION = 1000 // 1 second in milliseconds

    async enqueue(request: NextRequest) {
        return new Promise<Response>((resolve, reject) => {
            this.queue.push({ request, resolve, reject })
            this.processQueue()
        })
    }

    private async processQueue() {
        if (this.isProcessing || this.queue.length === 0) return

        this.isProcessing = true
        const { request, resolve, reject } = this.queue.shift()!
        const url = new URL(request.url)

        if (request.method === "GET") {
            const cacheKey = url.pathname + url.search
            const cachedData = this.cache.get(cacheKey)
            if (cachedData && Date.now() - cachedData.timestamp < this.CACHE_DURATION) {
                const response = new NextResponse(JSON.stringify(cachedData.data), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                })
                resolve(response)
                this.isProcessing = false
                this.processQueue()
                return
            }
        }

        try {
            const body = request.method !== "GET" ? await request.text() : undefined
            const path = url.pathname.replace("/api/proxy", "")

            const backendResponse = await fetch(env.BACKEND_URL + path, {
                method: request.method,
                headers: {
                    Authorization: "Bearer " + env.AUTH_TOKEN,
                    "Content-Type": "application/json",
                },
                body: body,
            })

            const responseData = await backendResponse.json()
            console.log("Response data:", responseData)

            // Cache GET requests
            if (request.method === "GET") {
                const url = new URL(request.url)
                const cacheKey = url.pathname + url.search
                this.cache.set(cacheKey, {
                    data: responseData,
                    timestamp: Date.now(),
                })
            }

            const response = new NextResponse(JSON.stringify(responseData), {
                status: backendResponse.status,
                headers: {
                    "Content-Type": "application/json",
                },
            })

            resolve(response)
        } catch (error) {
            console.error("Error processing request:", error)
            reject(
                new NextResponse(JSON.stringify({ error: "Request processing failed" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                })
            )
        } finally {
            this.isProcessing = false
            this.processQueue()
        }
    }

    // Method to clean up expired cache entries
    private cleanCache() {
        const now = Date.now()
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.CACHE_DURATION) {
                this.cache.delete(key)
            }
        }
    }
}

// Create a singleton instance of the queue
export const requestQueue = new RequestQueue()
