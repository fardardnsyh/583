'use client';

import React, { useState, useTransition } from 'react';
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
import { LoginSchema } from '@/schemas';
import * as z from "zod";
import Link from 'next/link';
import { login } from '@/lib/signInAction';
import Logo from '@/components/logo';


const Login = () => {
    const [isPending, startTransition] = useTransition()
    const [status, setStatus] = useState<{ error?: string; success?: string }>({});
    const router = useRouter();

    //zod implementation
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const submitForm = (data: z.infer<typeof LoginSchema>) => {
        startTransition(async () => {
            const response = await login(data)
            if (response.success) {
                setStatus({ success: response.success })
                router.replace('/dashboard')
            } else {
                setStatus({ error: response.error })
            }
        })
    };

    return (
        <CardWrapper
            cardTitle={<Logo className='w-60'/>}
            cardDescription="Login to your account"
            backButtonLabel="Don't have an account?"
            backButtonHref="/register"
            backButtonText="Register"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)} className="space-y-5">
                    <InputField
                        name='identifier'
                        label='Email / Username'
                        placeholder='Your email address or username'
                        control={form.control}
                    />
                    <div className='flex flex-col gap-y-2'>
                        <InputField
                            name='password'
                            type='password'
                            label='Password'
                            placeholder='Enter password'
                            control={form.control}
                        />
                        <Link href={"/forgot-password"} className=' text-sm text-gray-600 px-1'>Forgot password?</Link>
                    </div>

                    {status.error && <FormError message={status.error} />}
                    {status.success && <FormSuccess message={status.success} />}
                    <Button disabled={isPending} type='submit' className='w-full'>
                        {isPending ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default Login;
