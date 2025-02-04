import { NextRequest } from "next/server"
import { requestQueue } from "@/server/queue"

export async function GET(request: NextRequest) {
    return requestQueue.enqueue(request)
}

export async function POST(request: NextRequest) {
    return requestQueue.enqueue(request)
}

export async function PUT(request: NextRequest) {
    return requestQueue.enqueue(request)
}

export async function DELETE(request: NextRequest) {
    return requestQueue.enqueue(request)
}
