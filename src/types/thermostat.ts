export type FanStatus = "low" | "mid" | "high" | "auto_high"
export type SystemMode = "cool" | "heat" | "ventilation" | "auto_heat"

export type PowerOn = "off" | "on" | "previous"

export interface ThermostatData {
    temperature: number
    setPointTemp: number
    fanStatus: FanStatus
    powerOn: PowerOn
    systemMode: SystemMode
    setPointLowerLimit: number
    setPointUpperLimit: number
}

export interface EditableSettings {
    setPointTemp: number
    systemMode: SystemMode
    fanStatus: FanStatus
    setPointLowerLimit: number
    setPointUpperLimit: number
}

export interface ThermostatInfo {
    serialNumber: string
}
