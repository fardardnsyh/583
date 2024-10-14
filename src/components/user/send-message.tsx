'use client'

import { Form } from '@/components/ui/form'
import TextareaField from '@/components/textarea-field'
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import toast from "react-hot-toast"
import { UseFormReturn } from 'react-hook-form'
import { messageSchema } from '@/schemas'
import { z } from 'zod'

type SendMessageProps = {
    username: string;
    watchMessageContent: string;
    form: UseFormReturn<z.infer<typeof messageSchema>>; // Correct type for the form
}

const SendMessage = ({ username, watchMessageContent, form }: SendMessageProps) => {
    const [isPending, startTransition] = useTransition()
    // method for sending message
    const onMessageSend = () => {
        startTransition(async () => {
            try {
                const { data: response } = await axios.post<ApiResponse>('/api/send-message', {
                    username: username,
                    content: watchMessageContent
                })
                if (response.success) {
                    toast.success(response.message)
                } else {
                    toast.error(response.message)
                }
                form.setValue('content', '')
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                toast.error(axiosError.response?.data?.message || "Error while registering. Please try again later.")
            }
        })
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-12 text-center">
                Send Anonymous Message to @{username || 'username'}
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onMessageSend)}>
                    <TextareaField
                        name='content'
                        placeholder='Write your anonymous message here'
                        control={form.control}
                    />
                    <div className='w-full flex justify-center items-center mt-6'>
                        <Button
                            type='submit'
                            className=''
                            disabled={isPending}
                        >
                            Send it
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default SendMessage