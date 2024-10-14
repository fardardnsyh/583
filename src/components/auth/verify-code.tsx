import { Form } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import CardWrapper from "@/components/auth/card-wrapper";
import { ApiResponse } from "@/types/ApiResponse";
import { verificationCodeSchema } from "@/schemas";
import InputField from "@/components/input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import ResendCode from "@/components/auth/resend-code";
import dynamic from "next/dynamic";
const FormError = dynamic(() => import('@/components/form-error'), { ssr: false });
const FormSuccess = dynamic(() => import('@/components/form-success'), { ssr: false });
import axios, { AxiosError } from "axios";
import * as z from "zod";

type CodeVerificationProps = {
    email: string,
    type: "verify" | "reset",
    title: string,
    description: string
}

const CodeVerification = ({ title, description, email, type }: CodeVerificationProps) => {
    const [isPending, startTransition] = useTransition()
    const [status, setStatus] = useState<{ error?: string; success?: string }>({});
    const router = useRouter();

    //zod implementation
    const form = useForm<z.infer<typeof verificationCodeSchema>>({
        resolver: zodResolver(verificationCodeSchema),
        defaultValues: {
            code: '',
        },
    });

    const submitForm = (data: z.infer<typeof verificationCodeSchema>) => {
        startTransition(async () => {
            try {
                const { data: response } = await axios.post<ApiResponse>('/api/auth/verify-code', {
                    email,
                    code: data.code,
                    type: type,
                });
                if (response.success) {
                    setStatus({ success: response.message });
                    router.replace(`${type === 'verify' ? '/login' : `/forgot-password/new-password/${encodeURIComponent(email)}`}`);
                } else {
                    setStatus({ error: response.message });
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setStatus({ error: axiosError.response?.data?.message || "Error while registering. Please try again later." });
            }
        })
    };

    return (
        <CardWrapper
            cardTitle={title}
            cardDescription={description}
        >
            <Form {...form}>
                <form className="space-y-3" onSubmit={form.handleSubmit(submitForm)}>
                    <div>
                        <InputField
                            name="code"
                            placeholder="Enter 6 digit verification code"
                            inputClassName="text-center placeholder:text-center"
                            control={form.control}
                        />
                        <div className='w-full text-sm text-center text-muted-foreground '>
                            Didn&apos;t receive the code?{" "}
                            <ResendCode email={email} type={type} />
                        </div>
                    </div>
                    {status.error && <FormError message={status.error} />}
                    {status.success && <FormSuccess message={status.success} />}
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? 'Verifying...' : 'Verify'}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default CodeVerification;
