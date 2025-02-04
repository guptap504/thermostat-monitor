"use client"

import { ErrorComponent } from "@/components/error"
import { LoadingComponent } from "@/components/loading"
import { ThermostatDataComponent } from "@/components/thermostat-data"
import { ThermostatEditingComponent } from "@/components/thermostat-editing"
import { ThermostatData, ThermostatInfo } from "@/types/thermostat"
import { useEffect, useState } from "react"
import { getThermostatData, getThermostatInfo } from "./actions"

export default function Home() {
    const [editing, setEditing] = useState(false)
    const [data, setData] = useState<ThermostatData | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [info, setInfo] = useState<ThermostatInfo>({ serialNumber: "Unknown" })

    useEffect(() => {
        const fetchInfo = async () => {
            const info = await getThermostatInfo()
            setInfo(info)
        }
        fetchInfo()
    }, [])

    useEffect(() => {
        if (!editing) {
            const fetchData = async () => {
                const data = await getThermostatData()
                if (data.error) {
                    setError(new Error(data.error))
                } else {
                    setData(data.data)
                    setError(null)
                }
            }
            fetchData()
            const interval = setInterval(fetchData, 1000)
            return () => clearInterval(interval)
        }
    }, [editing])
    return (
        <div className="px-2 w-80 lg:w-[450px]">
            {error ? <ErrorComponent error={error} /> : null}
            {data ? (
                editing ? (
                    <ThermostatEditingComponent data={data} setEditing={setEditing} info={info} />
                ) : (
                    <ThermostatDataComponent data={data} setEditing={setEditing} info={info} />
                )
            ) : (
                <LoadingComponent />
            )}
        </div>
    )
}
