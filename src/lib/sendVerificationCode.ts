'use server'

import { ApiResponse } from '../types/ApiResponse';
import nodemailer from "nodemailer"
import { resetPasswordText, VerifyEmailText } from '@/data/emailContent';

export async function sendVerificationCode(
    email: string,
    code: string,
    type: "verify" | "reset"
): Promise<ApiResponse> {
    try {
        const transport = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_USER_PASS
            }
        });

        const mailOptions = {
            from: 'textnextauth@gmail.com',
            to: email,
            subject: type === "verify" ? "Email Verification Code" : "Password Reset Code",
            html: type === "verify" ? VerifyEmailText(code) : resetPasswordText(code)
        };

        await transport.sendMail(mailOptions)

        return { success: true, message: "Verification code send successfully" }
    } catch (error) {
        console.log("Error while sending verification code", error);
        return { success: false, message: "Error while sending verification code" }
    }
}