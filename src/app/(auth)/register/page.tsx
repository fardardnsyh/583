'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button';
import InputField from '@/components/input-field';
import { useRouter } from 'next/navigation';
import CardWrapper from '@/components/auth/card-wrapper';
import dynamic from "next/dynamic";
const FormError = dynamic(() => import('@/components/form-error'), { ssr: false });
const FormSuccess = dynamic(() => import('@/components/form-success'), { ssr: false });
import { useDebounceCallback } from 'usehooks-ts'
import { registerSchema } from '@/schemas';
import axios, { AxiosError } from "axios";
import * as z from "zod";
import { ApiResponse } from '@/types/ApiResponse';
import Logo from '@/components/logo';


const Register = () => {
    const [isPending, startTransition] = useTransition()
    const [username, setUsername] = useState<string>('')
    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false)
    const [usernameMsg, setUsernameMsg] = useState<{ error?: string; success?: string }>({})
    const [status, setStatus] = useState<{ error?: string; success?: string }>({});
    const debounced = useDebounceCallback(setUsername, 300);
    const router = useRouter();

    //zod implementation
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    //checking the availability of username using debouncing
    useEffect(() => {
        const checkingUsernameAvailability = async () => {
            if (username) {
                setIsCheckingUsername(true)
                try {
                    const { data: res } = await axios.get<ApiResponse>(`/api/auth/username-unique?username=${username}`)
                    if (res.success) {
                        setUsernameMsg({ success: res.message })
                    } else {
                        setUsernameMsg({ error: res.message })
                    }
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMsg({ error: axiosError.response?.data.message || 'An error occurred. Please try again later.' })
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkingUsernameAvailability()
    }, [username]);

    const submitForm = (data: z.infer<typeof registerSchema>) => {
        startTransition(async () => {
            try {
                const { data: response } = await axios.post<ApiResponse>('/api/auth/register', data)
                if (response.success) {
                    setStatus({ success: response.message })
                    router.replace(`/verify/${data.email}`)
                } else {
                    setStatus({ error: response.message })
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setStatus({ error: axiosError.response?.data?.message || "Error while registering. Please try again later." });
            }
        })
    };

    return (
        <CardWrapper
            cardTitle={<Logo className='w-60' />}
            cardDescription="Create an account"
            backButtonLabel="Already have an account?"
            backButtonHref="/login"
            backButtonText="Login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)} className="space-y-3">
                    <div>
                        <InputField
                            name="username"
                            label="Username"
                            placeholder="Your email address"
                            control={form.control}
                            debounced={debounced}
                        />
                        <div className="text-xs text-gray-600">
                            {isCheckingUsername ? "Checking availability....." : (
                                <p className={usernameMsg?.success ? 'text-emerald-500' : 'text-red-500'}>
                                    {usernameMsg?.success || usernameMsg?.error}
                                </p>
                            )}
                        </div>
                    </div>
                    <InputField
                        name='email'
                        label='Email'
                        placeholder='Your email address'
                        control={form.control}
                    />
                    <InputField
                        name='password'
                        type='password'
                        label='Password'
                        placeholder='Enter password'
                        control={form.control}
                    />
                    <InputField
                        name='confirmPassword'
                        label='Confirm Password'
                        placeholder='Confirm password'
                        control={form.control}
                    />
                    {status.error && <FormError message={status.error} />}
                    {status.success && <FormSuccess message={status.success} />}
                    <Button disabled={isPending} type='submit' className='w-full'>Sign Up</Button>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default Register;
