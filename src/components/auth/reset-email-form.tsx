'use client'

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import CardWrapper from './card-wrapper';
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { ResetEmailVerification } from '@/schemas';
import InputField from '../input-field';
import dynamic from "next/dynamic";
const FormError = dynamic(() => import('@/components/form-error'), { ssr: false });
const FormSuccess = dynamic(() => import('@/components/form-success'), { ssr: false });


const ResetEmailForm = () => {
    const [status, setStatus] = useState<{ error?: string; success?: string }>({});
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof ResetEmailVerification>>({
        resolver: zodResolver(ResetEmailVerification),
        defaultValues: {
            email: "",
        },
    });

    const submitForm = (data: z.infer<typeof ResetEmailVerification>) => {
        startTransition(async () => {
            try {
                const { data: response } = await axios.post<ApiResponse>('/api/auth/reset', data);
                if (response.success) {
                    setStatus({ success: response.message });
                    router.replace(`/forgot-password/verify/${encodeURIComponent(data.email)}`);
                } else {
                    setStatus({ error: response.message });
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setStatus({ error: axiosError.response?.data?.message || "Error while registering. Please try again later." });
            }
        });
    };

    return (
        <CardWrapper
            cardTitle='Reset Password'
            cardDescription='Please enter your e-mail address. You will receive an OTP or Code in this email, which can be used to reset your password.'
            backButtonText="Back to login"
            backButtonHref='/login'
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)} className='space-y-5'>
                    <InputField
                        name='email'
                        label='Email'
                        placeholder='Your email address'
                        control={form.control}
                    />

                    {status.error && <FormError message={status.error} />}
                    {status.success && <FormSuccess message={status.success} />}
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        {isPending ? 'Sending...' : 'Send'}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default ResetEmailForm