import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import type { ThermostatData, PowerOn, SystemMode, FanStatus, ThermostatInfo } from "@/types/thermostat"

function PowerStatus(props: { status: PowerOn }) {
    const { status } = props
    switch (status) {
        case "off":
            return <span className="text-red-600">OFF</span>
        case "on":
            return <span className="text-green-800">ON</span>
        case "previous":
            return <span className="text-yellow-800">PREVIOUS</span>
    }
}

const getSystemModeColor = (mode: SystemMode) => {
    switch (mode) {
        case "cool":
            return "bg-blue-100 text-blue-800"
        case "heat":
        case "auto_heat":
            return "bg-red-100 text-red-800"
        case "ventilation":
            return "bg-green-100 text-green-800"
    }
}

const getFanStatusColor = (status: FanStatus) => {
    if (status.includes("auto")) {
        return "bg-purple-100 text-purple-800"
    }
    return "bg-teal-100 text-teal-800"
}

export function ThermostatDataComponent(props: {
    data: ThermostatData
    setEditing: (editing: boolean) => void
    info: ThermostatInfo
}) {
    const { data, setEditing, info } = props
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <span className="text-4xl text-gray-900">Thermostat</span>
                            <span className="text-xs text-gray-400">{info.serialNumber}</span>
                        </div>
                        <Button onClick={() => setEditing(true)}>Edit</Button>
                    </div>
                </CardTitle>
                <CardDescription>
                    <div className="flex flex-row justify-between">Manage your thermostat in one-click.</div>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <div className="flex flex-row justify-between">
                    <span className="text-gray-600">Power Status</span>
                    <PowerStatus status={data.powerOn} />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Room Temperature</span>
                    <span className="text-4xl font-bold text-gray-800">{data.temperature}°C</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Set Point</span>
                    <div className="text-right">
                        <span className="text-2xl text-gray-800">{data.setPointTemp}°C</span>
                        <div className="text-xs text-gray-500">
                            Limit: {data.setPointLowerLimit}°C - {data.setPointUpperLimit}°C
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-600">System Mode</span>
                    <span className={`rounded-full px-3 py-1 text-sm ${getSystemModeColor(data.systemMode)}`}>
                        {data.systemMode
                            .split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Fan Status</span>
                    <span className={`rounded-full px-3 py-1 text-sm ${getFanStatusColor(data.fanStatus)}`}>
                        {data.fanStatus
                            .split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
