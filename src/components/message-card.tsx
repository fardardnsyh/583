import { Message } from '@/model/user'
import React from 'react'
import { Card, CardContent} from './ui/card'
import DeleteMessage from './delete-message'
// import dynamic from 'next/dynamic'
// const DeleteMessage = dynamic(() => import('./delete-message'), { ssr: false })

type messageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({ message, onMessageDelete }: messageCardProps) => {

    const formattedTime = new Date(message.createdAt).toLocaleString('en-US', {
        day: 'numeric',          // Day of the month (1, 2, 3, etc.)
        month: 'short',          // Short month name (e.g., Jan, Feb, etc.)
        year: 'numeric',         // Full year (e.g., 2024)
        hour: 'numeric',         // Hour (numeric value)
        minute: 'numeric',       // Minute (numeric value)
        hour12: true             // Use 12-hour time format (with AM/PM)
    });

    return (
        <Card className="max-w-md w-full">
            <CardContent className="p-4">
                <div className="flex justify-between items-start gap-5">
                    <div>
                        {/* Add break-words class here */}
                        <p className="text-lg mb-2  font-semibold text-wrap capitalize">{message.content}</p>
                        <p className="text-sm text-muted-foreground">{formattedTime}</p>
                    </div>
                    <DeleteMessage
                        messageId={message._id as string}
                        onMessageDelete={onMessageDelete}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

export default MessageCard
