"use server"

import { env } from "@/env"
import { retry } from "@/lib/retry"
import type {
    EditableSettings,
    FanStatus,
    PowerOn,
    SystemMode,
    ThermostatData,
    ThermostatInfo,
} from "@/types/thermostat"

function getFanStatus(fanStatus: number): FanStatus {
    if (fanStatus === 1) return "low"
    if (fanStatus === 2) return "mid"
    if (fanStatus === 3) return "high"
    if (fanStatus === 4) return "auto_low"
    if (fanStatus === 5) return "auto_mid"
    if (fanStatus === 6) return "auto_high"
    if (fanStatus === 7) return "auto_stop"
    return "auto_stop"
}

function getPowerOn(powerOn: number): PowerOn {
    if (powerOn === 0) return "off"
    if (powerOn === 1) return "on"
    if (powerOn === 2) return "previous"
    return "previous"
}

function getSystemMode(systemMode: number): SystemMode {
    if (systemMode === 1) return "cool"
    if (systemMode === 2) return "heat"
    if (systemMode === 3) return "ventilation"
    if (systemMode === 4) return "auto_cool"
    if (systemMode === 5) return "auto_heat"
    return "auto_cool"
}

function getSetPointLimits(limit: number): [number, number] {
    const lower = limit & 0x1f
    const upper = (limit >> 8) & 0x1f
    return [lower, upper]
}

interface GetThermostatDataResponse {
    data: ThermostatData | null
    error?: string
}

export async function getThermostatData(): Promise<GetThermostatDataResponse> {
    try {
        const response = await retry(
            async () => {
                const response = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/proxy/read`, {
                    headers: {
                        Authorization: `${env.AUTH_TOKEN}`,
                    },
                })
                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}: ${response.statusText}`)
                }
                return response
            },
            [],
            3
        )

        const data: number[] | undefined = await response.json()
        if (!data) {
            throw new Error("No data received from thermostat")
        }
        if (data.length !== 12) {
            throw new Error(`Invalid data length: expected 12, got ${data.length}`)
        }

        const temperature = (data[0] ?? 0) / 10
        const setPointTemp = data[2] ?? 0
        const fanStatus = data[3] ?? 1
        const powerOn = data[4] ?? 0
        const systemMode = data[5] ?? 1
        const [setPointLowerLimit, setPointUpperLimit] = getSetPointLimits(data[8] ?? 0)

        return {
            data: {
                temperature,
                setPointTemp,
                fanStatus: getFanStatus(fanStatus),
                powerOn: getPowerOn(powerOn),
                systemMode: getSystemMode(systemMode),
                setPointLowerLimit,
                setPointUpperLimit,
            },
        }
    } catch (error) {
        console.error(error)
        return {
            data: null,
            error: `Device is offline`,
        }
    }
}

export async function getThermostatInfo(): Promise<ThermostatInfo> {
    let response: Response | null = null
    try {
        response = await retry(
            async () => {
                const response = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/proxy/info`, {
                    headers: {
                        Authorization: `IHLWjIyX5Zeo5uA`,
                    },
                })
                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}: ${response.statusText}`)
                }
                return response
            },
            [],
            3
        )
    } catch {
        return {
            serialNumber: "Unknown",
        }
    }
    if (!response) {
        return {
            serialNumber: "Unknown",
        }
    }
    const data: { serial_number: string } | null = await response.json()
    if (!data) {
        return {
            serialNumber: "Unknown",
        }
    }
    return {
        serialNumber: data.serial_number,
    }
}

function getFanStatusNumber(status: FanStatus): number {
    switch (status) {
        case "low":
            return 1
        case "mid":
            return 2
        case "high":
            return 3
        case "auto_low":
            return 4
        case "auto_mid":
            return 5
        case "auto_high":
            return 6
        case "auto_stop":
            return 7
    }
}

function getSystemModeNumber(mode: SystemMode): number {
    switch (mode) {
        case "cool":
            return 1
        case "heat":
            return 2
        case "ventilation":
            return 3
        case "auto_cool":
            return 4
        case "auto_heat":
            return 5
    }
}

function encodeSetPointLimits(lower: number, upper: number): number {
    return (lower & 0x1f) | ((upper & 0x1f) << 8)
}

async function writeToThermostat(register: number, data: number, parameter: string): Promise<void> {
    try {
        await retry(
            async () => {
                const response = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/proxy/set/${register}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `${env.AUTH_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ value: data }),
                })
                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}: ${response.statusText}`)
                }
                return response
            },
            [],
            3
        )
    } catch (error) {
        throw new Error(
            `Failed to update thermostat ${parameter} settings: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        )
    }
}

export async function setThermostatData(settings: EditableSettings): Promise<void> {
    const currentData = await getThermostatData()
    if (currentData.error) {
        throw new Error(currentData.error)
    }
    if (settings.setPointTemp !== currentData.data?.setPointTemp) {
        const setPointTemp = settings.setPointTemp
        await writeToThermostat(3, setPointTemp, "setPointTemp")
    }
    if (settings.fanStatus !== currentData.data?.fanStatus) {
        const fanStatus = getFanStatusNumber(settings.fanStatus)
        await writeToThermostat(4, fanStatus, "fanStatus")
    }
    if (settings.systemMode !== currentData.data?.systemMode) {
        const systemMode = getSystemModeNumber(settings.systemMode)
        await writeToThermostat(6, systemMode, "systemMode")
    }

    if (
        settings.setPointLowerLimit !== currentData.data?.setPointLowerLimit ||
        settings.setPointUpperLimit !== currentData.data?.setPointUpperLimit
    ) {
        const setPointLimits = encodeSetPointLimits(settings.setPointLowerLimit, settings.setPointUpperLimit)
        await writeToThermostat(9, setPointLimits, "setPointLimits")
    }
}
