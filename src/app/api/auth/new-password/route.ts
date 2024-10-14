import { dbConnect } from "@/db/dbConnect";
import UserModel from "@/model/user";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { email, password } = await request.json();
        const decodedEmail = decodeURIComponent(email)

        //getting user from database
        const existingUser = await UserModel.findOne({ email:decodedEmail });
        if (!existingUser) {
            return NextResponse.json({
                success: false,
                message: "User not found!"
            })
        }

        //hashing password
        const hashedPassword = await bcryptjs.hash(password, 10);

        //updating password
        existingUser.password = hashedPassword;
        existingUser.save();

        //login the user base on his email and password
        // await signIn("credentials", {
        //     identifier: email,
        //     password: password,
        //     redirect: false,
        // })

        return NextResponse.json({
            success: true,
            message: "Password updated successfully!"
        })
    } catch (error) {
        console.log("Error while updating password", error);
        return NextResponse.json({
            success: false,
            message: "Error while updating password",
        })
    }
}