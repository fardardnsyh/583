import { dbConnect } from "@/db/dbConnect";
import { generateCode } from "@/lib/generateCode";
import { sendVerificationCode } from "@/lib/sendVerificationCode";
import UserModel from "@/model/user";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    await dbConnect()
    try {
        const { email } = await request.json();
        const user = await UserModel.findOne({ email });

        //checking user already exist or not
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Email does not exist!"
            })
        }

        //generate reset code and send to the user registered email
        const code = generateCode();

        //save the reset code and its expiry to the database
        user.passwordResetCode = code;
        user.PasswordResetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Perform save and email operations parallely
        const [, emailResponse] = await Promise.all([
            user.save(),
            sendVerificationCode(email, code, "reset")
        ]);

        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: "Failed to send reset code to your email!"
            })
        }

        return NextResponse.json({
            success: true,
            message: "Reset code sent to your email!"
        })
    } catch (error) {
        console.log("Error while checking email existance and sending reset verification code: ", error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong. Please try again."
        })
    }
}