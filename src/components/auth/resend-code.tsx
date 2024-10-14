import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import axios from 'axios'

type ResendCodeProps = {
    email: string,
    type: "verify" | "reset"
}

const ResendCode = ({ email, type }: ResendCodeProps) => {
    const [counter, setCounter] = useState<number>(0);

    const resendCode = useCallback(async () => {
        if (counter > 0) return; // Prevent multiple triggers before countdown ends

        try {
            setCounter(60); // Reset the counter immediately
            const { data: response } = await axios.post("/api/auth/resend-code", { email, type });
            if (response.success) {
                console.log(response.message);
            }
        } catch (error) {
            console.error(error instanceof Error ? error.message : "Something went wrong.");
        }
    }, [email, type, counter]);

    useEffect(() => {
        if (counter <= 0) return; // No need to run if counter is 0

        const intervalId = setInterval(() => {
            setCounter((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup the interval
    }, [counter]);

    return (
        <Button
            variant="transparentBtn"
            className="p-0 pl-1 text-sm"
            onClick={resendCode}
            disabled={counter > 0} // Disable if still counting
        >
            {counter > 0 ? `Resend in ${counter}s` : "Resend"}
        </Button>
    )
}

export default ResendCode