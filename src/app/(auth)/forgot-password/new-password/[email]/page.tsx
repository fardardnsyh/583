'use client'

import NewPassword from '@/components/auth/new-password'
import { useParams } from 'next/navigation';
import React from 'react'

const SetNewPassword = () => {
    const params = useParams<{ email: string }>();
    const email = decodeURIComponent(params.email);
    return (
        <>
            <NewPassword
                email={email}
            />
        </>
    )
}

export default SetNewPassword