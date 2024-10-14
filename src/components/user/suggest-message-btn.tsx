import { Button } from '../ui/button'

type SuggestMessageBtnProps = {
    message: string
    setValue: (name: string, value: string) => void
}

const SuggestMessageBtn = ({ message, setValue }: SuggestMessageBtnProps) => {
    const handleSuggesMessage = (message: string) => {
        // Call setValue with the form field name 'content' and the selected message
        setValue('content', message)
    }

    return (
        <>
            {/* For large devices */}
            <Button
                variant="outline"
                className="w-full justify-center text-left h-auto py-2 sm:flex hidden"
                onClick={() => handleSuggesMessage(message)}
            >
                {message.length > 80 ? message.slice(0, 80) + '...' : message}
            </Button>

            {/* For small devices */}
            <Button
                variant="outline"
                className="w-full justify-center text-left h-auto py-2 flex sm:hidden"
                onClick={() => handleSuggesMessage(message)}
            >
                {message.length > 45 ? message.slice(0, 45) + '...' : message}
            </Button>
        </>
    )
}

export default SuggestMessageBtn
