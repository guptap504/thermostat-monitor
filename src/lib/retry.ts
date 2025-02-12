// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function retry<T extends (...arg0: any[]) => any>(
    fn: T,
    args: Parameters<T>,
    maxTry: number,
    retryCount = 1
): Promise<Awaited<ReturnType<T>>> {
    const currRetry = typeof retryCount === "number" ? retryCount : 1
    try {
        const result = await fn(...args)
        return result
    } catch (e) {
        if (currRetry > maxTry) {
            throw e
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
        return retry(fn, args, maxTry, currRetry + 1)
    }
}
