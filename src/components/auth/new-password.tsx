"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import CardWrapper from "./card-wrapper"
import { Form } from "../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { NewPasswordSchema } from "@/schemas"
import { ApiResponse } from "@/types/ApiResponse"
import InputField from "../input-field"
import dynamic from "next/dynamic";
const FormError = dynamic(() => import('@/components/form-error'), { ssr: false });
const FormSuccess = dynamic(() => import('@/components/form-success'), { ssr: false });
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { z } from "zod"

type NewPasswordProps = {
    email: string
}

export default function NewPassword({email}:NewPasswordProps) {
    const [status, setStatus] = useState<{ error?: string; success?: string }>({});
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        }
    })

    const submitForm = (data: z.infer<typeof NewPasswordSchema>) => {
        startTransition(async () => {
            try {
                const { data: response } = await axios.post<ApiResponse>(`/api/auth/new-password`, {...data, email})
                if (response.success) {
                    setStatus({ success: response.message })
                    router.replace("/login")
                } else {
                    setStatus({ error: response.message })
                }
            } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setStatus({ error: axiosError.response?.data?.message || "Error while registering. Please try again later." })
                }
            })
    }


    return (
        <CardWrapper
            cardTitle="Create New Password"
            cardDescription="Create a new password for your account"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
                    <InputField
                        name='password'
                        type='password'
                        label='Password'
                        placeholder='Enter password'
                        control={form.control}
                    />
                    <InputField
                        name='confirmPassword'
                        label='Confirm Password'
                        placeholder='Confirm password'
                        control={form.control}
                    />
                    {status.error && <FormError message={status.error} />}
                    {status.success && <FormSuccess message={status.success} />}
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Updating..." : "Update Password"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}