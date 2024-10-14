import { dbConnect } from "@/db/dbConnect";
import UserModel from "@/model/user";
import { NextResponse } from "next/server";

interface verifyPorpsType{
    email: string;
    code: string;
    type: "verify" | "reset";
}

export async function  POST(request:Request) {
    await dbConnect()
    try {
        const { email, code, type }: verifyPorpsType = await request.json();

        //encoded email 
        const decodedEmail = decodeURIComponent(email);

        //find and checking user exist or not in this email 
        const user = await UserModel.findOne({ email: decodedEmail });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found!"
            }, { status: 404 })
        }

        // Determine which code and expiry to check based on the type (verify or reset)
        const userCode = type === "verify" ? user.verifyCode : user.passwordResetCode;
        const expiry = type === "verify" ? user.verifyCodeExpiry : user.PasswordResetCodeExpiry;

        //check verification code and its expiry
        const isCodeMatch = userCode === code;
        const isCodeValid = expiry ? expiry.getTime() > Date.now() : false;

        if (isCodeMatch && isCodeValid) {
            if (type === "verify") {
                user.isVerified = true;
                await user.save();
                return NextResponse.json({
                    success: true,
                    message: "Email verification successful!"
                }, { status: 200 });
            } else {
                return NextResponse.json({
                    success: true,
                    message: "Password reset verification successful!"
                }, { status: 200 });
            }
        } else if (!isCodeMatch) {
            return NextResponse.json({
                success: false,
                message: "Incorrect verification code!"
            })
        } else {
            return NextResponse.json({
                success: false,
                message: "Verification code expired!"
            })
        }
    } catch (error) {
        console.log("Error while verifing verification code", error);
        return NextResponse.json({
            success: false,
            message: "Error while verifing verification code"
        }, { status: 500 })
    }
}