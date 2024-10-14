'use client'

import { Message } from "@/model/user";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
// import MessageCard from "../message-card";
import { Button } from "../ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import dynamic from "next/dynamic";
const MessageCard = dynamic(() => import('../message-card'), { ssr: false });

const AllMessages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isPending, startTransition] = useTransition();

    // deleting a message in frontend side
    const deleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    // fetching user all messages
    const fetchMessages = useCallback((refresh: boolean = false) => {
        startTransition(async () => {
            try {
                const { data: response } = await axios.get<ApiResponse>(`api/get-messages`);
                if (response.success) {
                    setMessages(response.messages || []);
                } else {
                    toast.error(response.message);
                }

                if (refresh) {
                    toast.success("Showing new messages");
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast.error(
                    axiosError.response?.data?.message ||
                    "Error while fetching messages. Please try again later."
                );
            }
        });
    }, [setMessages]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    return (
        <>
            <Button
                className="mt-4"
                variant={"outline"}
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
                disabled={isPending}
                aria-label="refresh messages"
            >
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-md:place-items-center">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                            key={message._id}
                            message={message}
                            onMessageDelete={deleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </>
    );
};

export default AllMessages;
