import { dbConnect } from "@/db/dbConnect";
import UserModel, { Message } from "@/model/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, content } = await request.json();
    
        const user = await UserModel.findOne({ username });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found!",
            }, { status: 404 });
        }
    
        //checking if user is accepting message or not
        if (!user.isAcceptingMessage) {
            return NextResponse.json({
                success: false,
                message: "User is not accepting messages!",
            }, { status: 400 });
        }
    
        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);
        await user.save();
    
        return NextResponse.json({
            success: true,
            message: "Message sent successfully!"
        }, { status: 200 });
    }
    catch (error) {
        console.log("Error while sending message", error);
        return NextResponse.json({
            success: false,
            message: "Error while sending message",
        }, { status: 500 });
    }
}