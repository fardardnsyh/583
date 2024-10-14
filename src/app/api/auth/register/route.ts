import { dbConnect } from "@/db/dbConnect";
import UserModel from "@/model/user";
import { NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import { generateCode } from "@/lib/generateCode";
import { sendVerificationCode } from "@/lib/sendVerificationCode";

export const POST = async (request: Request) => {
    await dbConnect();
    try {
        //get request data
        const { username, email, password } = await request.json();

        //check username already exists or not
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingVerifiedUserByUsername) {
            return NextResponse.json({
                success: false,
                message: "Username already exists!"
            }, { status: 400 })
        }

        //find user by email 
        const existingUserByEmail = await UserModel.findOne({ email });
        //generate verify code
        const verifyCode = generateCode();

        if (existingUserByEmail) {
            //if email already verified 
            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "Email already exist!"
                }, { status: 400 })
            }

            //if email not verified
            existingUserByEmail.password = await bcryptjs.hash(password, 10);
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 15 * 60 * 1000) //15 min
            existingUserByEmail.verifyCode = verifyCode;
            await existingUserByEmail.save();
        } else {
            //if user is new
            const hashedPassword = await bcryptjs.hash(password, 10);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                isVerified: false,
                verifyCodeExpiry: new Date(Date.now() + 15 * 60 * 1000), //15 min
                verifyCode,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save();
        }

        //send verification email with code
        const emailResponse = await sendVerificationCode(email, verifyCode, "verify");

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
        }, { status: 201 })

    } catch (error) {
        console.log("Error registering user: ", error);
        return NextResponse.json({
            success: false,
            message: "Error registering user"
        }, { status: 500 })
    }
}