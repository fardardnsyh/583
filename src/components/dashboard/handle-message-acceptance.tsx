'use client'

import { acceptMessageSchema } from "@/schemas"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useCallback, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Switch } from "../ui/switch"

const HandleMessageAcceptance = () => {
    const [isPending, startTransition] = useTransition()

    const { register, watch, setValue } = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessages: true, // Initial value for acceptMessages
        }
    });

    const acceptMessages:boolean = watch('acceptMessages')

    // Fetching the user acceptance status
    const fetchAcceptMessagesStatus = useCallback(async () => {
        try {
            const { data: response } = await axios.get<ApiResponse>(`api/accept-messages`)
            if (response.success) {
                // Only update state if the value has actually changed
                if (response.isAcceptingMessage !== acceptMessages) {
                    setValue('acceptMessages', response.isAcceptingMessage ?? false) // Provide default value if undefined
                }
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data?.message || "Error while fetching the status. Please try again later.")
        }
    }, [setValue, acceptMessages])

    useEffect(() => {
        fetchAcceptMessagesStatus();
    }, [fetchAcceptMessagesStatus])

    // Handle accept messages status change
    const handleSwitchChange = async () => {
        startTransition(async () => {
            try {
                const { data: response } = await axios.post<ApiResponse>(
                    `api/accept-messages`,
                    { isAcceptMessage: !acceptMessages } // Correctly flip the value
                );
                if (response.success) {
                    setValue('acceptMessages', response.isAcceptingMessage ?? false); // Provide default value if undefined
                    toast.success(response.message);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast.error(axiosError.response?.data?.message || "Error while updating the status. Please try again later.");
            }
        });
    };

    return (
        <div className="mb-4 flex items-center gap-4">
            <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isPending}
                aria-label="Accept Messages"
            />
            <p>
                Accept Messages :{" "}
                {acceptMessages ? (
                    <span className="text-emerald-600 font-semibold">On</span>
                ) : (
                    <span className="text-red-600 font-semibold">Off</span>
                )}
            </p>
        </div>
    )
}

export default HandleMessageAcceptance
