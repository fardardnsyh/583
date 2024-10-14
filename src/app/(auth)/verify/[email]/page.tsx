'use client';

import { useParams } from "next/navigation";
import CodeVerification from "@/components/auth/verify-code";

const EmailVerification = () => {
    const params = useParams<{ email: string }>();
    const email = params.email;

    return (
        <>
            <CodeVerification
                title="Verify Your Account"
                description="Enter the one-time password (OTP) or verification code sent to your registered email address."
                email={email}
                type="verify"
            />
        </>
    );
};

export default EmailVerification;
