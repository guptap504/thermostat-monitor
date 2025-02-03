"use client"

import Image from "next/image"
import { ThermostatDataComponent } from "@/components/thermostat-data"
import { ThermostatEditingComponent } from "@/components/thermostat-editing"
import { ThermostatData } from "@/types/thermostat"
import { useState } from "react"

const data: ThermostatData = {
    temperature: 20,
    setPointTemp: 20,
    fanStatus: "low",
    powerOn: "off",
    systemMode: "cool",
    setPointLowerLimit: 10,
    setPointUpperLimit: 30,
}

export default function Home() {
    const [editing, setEditing] = useState(false)
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center  p-2 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center">
                <Image src="/logo.png" alt="Thermostat Logo" width={120} height={40} className="h-10 w-auto" priority />
                <div className="px-2 w-80 lg:w-[450px]">
                    {editing ? (
                        <ThermostatEditingComponent data={data} setEditing={setEditing} />
                    ) : (
                        <ThermostatDataComponent data={data} setEditing={setEditing} />
                    )}
                </div>
            </main>
        </div>
    )
}
