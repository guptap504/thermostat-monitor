"use client"

import { ErrorComponent } from "@/components/error"
import { LoadingComponent } from "@/components/loading"
import { ThermostatDataComponent } from "@/components/thermostat-data"
import { ThermostatEditingComponent } from "@/components/thermostat-editing"
import { ThermostatData } from "@/types/thermostat"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getThermostatData } from "./actions"

export default function Home() {
    const [editing, setEditing] = useState(false)
    const [data, setData] = useState<ThermostatData | null>(null)
    const [error, setError] = useState<Error | null>(null)
    useEffect(() => {
        if (!editing) {
            const fetchData = async () => {
                try {
                    const data = await getThermostatData()
                    setData(data)
                    setError(null)
                } catch (e) {
                    setError(e)
                }
            }
            fetchData()
            const interval = setInterval(fetchData, 1000)
            return () => clearInterval(interval)
        }
    }, [editing])
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center  p-2 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center">
                <Image src="/logo.png" alt="Thermostat Logo" width={120} height={40} className="h-10 w-auto" priority />
                <div className="px-2 w-80 lg:w-[450px]">
                    {error ? <ErrorComponent error={error} /> : null}
                    {data ? (
                        editing ? (
                            <ThermostatEditingComponent data={data} setEditing={setEditing} />
                        ) : (
                            <ThermostatDataComponent data={data} setEditing={setEditing} />
                        )
                    ) : (
                        <LoadingComponent />
                    )}
                </div>
            </main>
        </div>
    )
}
