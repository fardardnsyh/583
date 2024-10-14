import * as z from "zod"

export const usernameValidation = z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers");

export const usernameSchema = z.object({
    username: usernameValidation
})

export const EmailValidation = z
    .string()
    .email({ message: "Invalid email address" })

export const registerSchema = z.object({
    username: usernameValidation,
    email: EmailValidation,
    password: z.string().min(6, {
        message: "Password must be at least 6 characters"
    }).regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Password does not match!",
    path: ["confirmPassword"]
})

export const LoginSchema = z.object({
    identifier: z.string(),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters",
    }),
})

export const ResetEmailVerification = z.object({
    email: EmailValidation
})

export const NewPasswordSchema = z.object({
    password: z.string()
        .min(6, {
            message: "Password must be at least 6 characters"
        })
        .regex(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    confirmPassword: z.string()
        .min(6, {
            message: "Password must be at least 6 characters"
        })
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"]
});

export const verificationCodeSchema = z.object({
    code: z.string().length(6, {
        message: "Verification code is required!"
    })
})

export const acceptMessageSchema = z.object({
    acceptMessage: z.boolean()
})

export const messageSchema = z.object({
    content: z
        .string()
        .min(5, "Message must be at least 5 characters long")
        .max(200, "Message must be at most 200 characters long")
})