import { auth } from "@/auth";
import { dbConnect } from "@/db/dbConnect";
import UserModel from "@/model/user";
import { NextResponse } from "next/server";

//update user message acceptance status 
export async function POST(request: Request) {
    await dbConnect()

    const session = await auth()
    const user = session?.user;

    if (!user) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, {
            status: 401
        })
    }

    const userId = user._id
    const { isAcceptMessage } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: isAcceptMessage },
            { new: true }
        )

        if (!updatedUser) {
            return NextResponse.json({
                success: false,
                message: "Failed to update message accepted status"
            }, { status: 401 })
        }

        return NextResponse.json({
            success: true,
            message: "Message acceptance status updated successfully",
            isAcceptingMessage: updatedUser.isAcceptingMessage
        }, { status: 200 })
    } catch (error) {
        console.log("Error while updating message accepted status", error)
        return NextResponse.json({
            success: false,
            message: "Error while updating message accepted status"
        }, { status: 500 })
    }
}

//getting the user acceptence status means user is accept messages or not
export async function GET() {
    await dbConnect()

    const session = await auth()
    const user = session?.user;

    if (!user) {
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, {
            status: 401
        })
    }

    const userId = user._id

    try {
        const user = await UserModel.findById(userId)
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found!"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "User message accepted status fetched successfully",
            isAcceptingMessage: user.isAcceptingMessage
        }, { status: 200 })
    } catch (error) {
        console.log("Error while getting message accepted status", error)
        return NextResponse.json({
            success: false,
            message: "Error while getting message accepted status"
        }, { status: 500 })
    }
}