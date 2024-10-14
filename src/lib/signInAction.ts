'use server';

import bcryptjs from 'bcryptjs';
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import * as z from "zod";
import { LoginSchema } from '@/schemas';
import UserModel from '@/model/user';
import { dbConnect } from '@/db/dbConnect';

export const login = async (data: z.infer<typeof LoginSchema>) => {
    await dbConnect();
    const existingUser = await UserModel.findOne({
        $or: [
            { email: data.identifier },
            { username: data.identifier }
        ]
    });

    if (!existingUser) {
        return { error: "User does not exist!" }
    }

    const isPasswordMatch = await bcryptjs.compare(data.password, existingUser.password);
    if (!isPasswordMatch) {
        return { error: "Incorrect password!" }
    }

    if (!existingUser.isVerified) {
        return { error: "Email is not verified, please register again with verified email" }
    }

    try {
        await signIn("credentials", {
            identifier: data.identifier,
            password: data.password,
            redirect: false,
        })
        return { success: "Logged in successfully!" }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }
        throw error;
    }
}

//social login or sign up
export const handleSignIn = async (provider: "google" | "github") => {
    await signIn(provider, {
        redirectTo: "/"
    })
};

export const logOut = async () => {
    await signOut({ redirectTo: "/login" })
}
