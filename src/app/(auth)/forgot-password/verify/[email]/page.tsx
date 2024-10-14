'use client';

import { useParams } from "next/navigation";
import CodeVerification from "@/components/auth/verify-code";

const ResetCodeVerification = () => {
    const params = useParams<{ email: string }>();
    const email = params.email;

    return (
        <>
            <CodeVerification
                title="Password Reset Verificaion"
                description="Please enter 6 digit reset verification code or OTP that you have receive in your provided email address."
                email={email}
                type="reset"
            />
        </>
    );
};

export default ResetCodeVerification;
