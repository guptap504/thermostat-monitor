"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { OTPInputContext } from "input-otp"
import { useContext } from "react"

import { authenticate } from "@/app/login/actions"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup } from "@/components/ui/input-otp"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

// Create a custom masked slot component
const MaskedInputOTPSlot = ({ index, ...props }: { index: number } & React.ComponentPropsWithoutRef<"div">) => {
    const inputOTPContext = useContext(OTPInputContext)
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

    return (
        <div
            className={cn(
                "relative h-10 w-10 rounded-md border border-input bg-background text-center text-sm shadow-sm transition-all",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-background",
                "group-hover:border-muted-foreground/20",
                { "border-muted-foreground/20": !isActive }
            )}
            {...props}
        >
            {char ? <div className="absolute inset-0 flex items-center justify-center">*</div> : null}
            {hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
                </div>
            )}
        </div>
    )
}

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})

export function InputOTPForm() {
    const router = useRouter()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const result = await authenticate(data.pin)
        if (result.success) {
            router.push("/")
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Login PIN</FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                        <MaskedInputOTPSlot index={0} />
                                        <MaskedInputOTPSlot index={1} />
                                        <MaskedInputOTPSlot index={2} />
                                        <MaskedInputOTPSlot index={3} />
                                        <MaskedInputOTPSlot index={4} />
                                        <MaskedInputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
