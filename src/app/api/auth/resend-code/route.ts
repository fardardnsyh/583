import { dbConnect } from "@/db/dbConnect";
import { generateCode } from "@/lib/generateCode";
import { sendVerificationCode } from "@/lib/sendVerificationCode";
import UserModel from "@/model/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { email, type } = await request.json();
        const decodedEmail = decodeURIComponent(email);

        //checking user exist or not in this email
        const existingUser = await UserModel.findOne({ email: decodedEmail });
        
        if (!existingUser) {
            return NextResponse.json({
                success: false,
                message: "User not found!"
            }, { status: 404 });
        }

        //generate code
        const code = generateCode();

        // update the code in database accoding to their type 
        if (type === "verify") {
            existingUser.verifyCode = code;
            existingUser.verifyCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 5 minutes
        } else if (type === "reset") {
            existingUser.passwordResetCode = code;
            existingUser.PasswordResetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 5 minutes
        }

        //save the updated user
        await existingUser.save();

        // send the verification code via email
        const emailResponse = await sendVerificationCode(decodedEmail, code, type);
        //if email not sent
        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: "Verification code send successfully"
        }, { status: 200 });
    } catch (error) {
        console.log("Errror while resending verification code", error);
        return NextResponse.json({
            success: false,
            message: "Error while resending verification code"
        }, { status: 500 });
    }
}