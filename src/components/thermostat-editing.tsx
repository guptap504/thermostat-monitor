"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import type { ThermostatData } from "@/types/thermostat"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const formSchema = z.object({
    setpoint: z.coerce
        .number()
        .min(5, {
            message: "Setpoint must be greater than 5",
        })
        .max(45, { message: "Setpoint must be less than 45" }),
    lowerLimit: z.coerce.number().min(5, {
        message: "Lower limit must be greater than 5",
    }),
    upperLimit: z.coerce.number().max(45, {
        message: "Upper limit must be less than 45",
    }),
    systemMode: z.enum(["cool", "heat", "ventilation", "auto_cool", "auto_heat"]),
    fanStatus: z.enum(["low", "mid", "high", "auto_low", "auto_mid", "auto_high", "auto_stop"]),
})

export function ThermostatEditingComponent(props: { data: ThermostatData; setEditing: (editing: boolean) => void }) {
    const { data, setEditing } = props
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            setpoint: data.setPointTemp,
            lowerLimit: data.setPointLowerLimit,
            upperLimit: data.setPointUpperLimit,
            systemMode: data.systemMode,
            fanStatus: data.fanStatus,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setEditing(false)
        console.log(values)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row justify-between">
                        Thermostat
                        <Button disabled variant="outline">
                            Editing
                        </Button>
                    </div>
                </CardTitle>
                <CardDescription>
                    <div className="flex flex-row justify-between">Manage your thermostat in one-click.</div>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                        <FormField
                            control={form.control}
                            name="setpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-row justify-between">
                                        <FormLabel>
                                            <span className="text-lg text-gray-600">Set Point (°C)</span>
                                        </FormLabel>
                                        <div className="flex flex-row gap-2">
                                            <FormControl>
                                                <Input
                                                    className="w-16"
                                                    min={data.setPointLowerLimit}
                                                    max={data.setPointUpperLimit}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="systemMode"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-row justify-between">
                                        <FormLabel>
                                            <span className="text-lg text-gray-600">System Mode</span>
                                        </FormLabel>
                                        <div className="flex flex-row gap-2">
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Mode" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value="cool">Cool</SelectItem>
                                                            <SelectItem value="heat">Heat</SelectItem>
                                                            <SelectItem value="ventilation">Ventilation</SelectItem>
                                                            <SelectItem value="auto_cool">Auto Cool</SelectItem>
                                                            <SelectItem value="auto_heat">Auto Heat</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fanStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-row justify-between">
                                        <FormLabel>
                                            <span className="text-lg text-gray-600">Fan Status</span>
                                        </FormLabel>
                                        <div className="flex flex-row gap-2">
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value="low">Low</SelectItem>
                                                            <SelectItem value="mid">Mid</SelectItem>
                                                            <SelectItem value="high">High</SelectItem>
                                                            <SelectItem value="auto_low">Auto Low</SelectItem>
                                                            <SelectItem value="auto_mid">Auto Mid</SelectItem>
                                                            <SelectItem value="auto_high">Auto High</SelectItem>
                                                            <SelectItem value="auto_stop">Auto Stop</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lowerLimit"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-row justify-between">
                                        <FormLabel>
                                            <span className="text-lg text-gray-600">Lower Limit (°C)</span>
                                        </FormLabel>
                                        <div className="flex flex-row gap-2">
                                            <FormControl>
                                                <Input
                                                    className="w-16"
                                                    min={data.setPointLowerLimit}
                                                    max={data.setPointUpperLimit}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="upperLimit"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-row justify-between">
                                        <FormLabel>
                                            <span className="text-lg text-gray-600">Upper Limit (°C)</span>
                                        </FormLabel>
                                        <div className="flex flex-row gap-2">
                                            <FormControl>
                                                <Input
                                                    className="w-16"
                                                    min={data.setPointLowerLimit}
                                                    max={data.setPointUpperLimit}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row justify-between gap-2">
                            <Button type="submit" className="w-full">
                                Save
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setEditing(false)
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
