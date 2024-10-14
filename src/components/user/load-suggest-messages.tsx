import { ApiResponse } from '@/types/ApiResponse'
import  { AxiosError } from 'axios'
import React, { useTransition } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'

type LoadSuggestMessagesProps = {
    setText: (text: string) => void
}

const LoadSuggestMessages = ({ setText }: LoadSuggestMessagesProps) => {
    const [isPending, startTransition] = useTransition()

    // generate suggest messages
    // const loadSuggestMessages = () => {
    //     startTransition(async () => {
    //         try {
    //             const { data: response } = await axios.get<ApiResponse>('/api/suggest-messages')
    //             if (response.success) {
    //                 setText(response.message)
    //             } else {
    //                 toast.error(response.message)
    //             }
    //         } catch (error) {
    //             const axiosError = error as AxiosError<ApiResponse>
    //             toast.error(axiosError.response?.data?.message || "Error while registering. Please try again later.")
    //         }
    //     })
    // }

    const loadSuggestMessages = () => {
        startTransition(async () => {
            try {
                const data = await fetch('/api/suggest-messages', {
                    next: {
                        revalidate: 0, // Disable ISR
                    },
                    cache: 'no-store',  // Prevent browser caching
                    headers: {
                        'Cache-Control': 'no-store, no-cache', // Ensure fresh data is fetched
                    },
                });

                const response: ApiResponse =await data.json()
                if (response.success) {
                    setText(response.message)
                } else {
                    toast.error(response.message)
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                toast.error(axiosError.response?.data?.message || "Error while registering. Please try again later.")
            }
        })
    }
    return (
        <>
            <Button onClick={loadSuggestMessages} disabled={isPending}>
                Suggest Messages
            </Button>
        </>
    )
}

export default LoadSuggestMessages