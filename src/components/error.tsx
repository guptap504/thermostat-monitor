export function ErrorComponent(props: { error: Error }) {
    return (
        <div className="rounded-lg bg-red-50 p-4 text-red-500">
            <div className="flex flex-col items-center justify-center">
                <div className="text-red-500">{props.error.message}</div>
            </div>
        </div>
    )
}
