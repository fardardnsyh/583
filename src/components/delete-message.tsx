import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ApiResponse } from "@/types/ApiResponse"
import axios, { AxiosError } from "axios"
import { Trash } from "lucide-react"
import toast from "react-hot-toast"

type DeleteMessageProps = {
    messageId: string,
    onMessageDelete: (messageId: string) => void;
}
const DeleteMessage = ({ messageId, onMessageDelete }: DeleteMessageProps) => {
    const handleDeleteMessage = async () => {
        try {
            onMessageDelete(messageId)
            const { data: response } = await axios.delete<ApiResponse>(`api/delete-message/${messageId}`)
            if (response.success) {
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data?.message || "Error while deleting message. Please try again later.");
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="px-2.5" aria-label="Delete message">
                    <Trash className="h-5 w-5"/>
                </Button>   
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        message and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteMessage}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteMessage
