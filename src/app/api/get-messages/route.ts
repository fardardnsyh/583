import { auth } from "@/auth";
import { dbConnect } from "@/db/dbConnect";
import UserModel from "@/model/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

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

    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        const userMessages = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$id", messages: { $push: "$messages" } } }
        ])

        if (!userMessages) {
            return NextResponse.json({
                success: false,
                message: "User not found!"
            }, {
                status: 404
            })
        }

        return NextResponse.json({
            success: true,
            message: "User messages fetched successfully",
            messages: userMessages.length !== 0 ? userMessages[0].messages : []
        }, { status: 200 })
    } catch (error) {
        console.log("Error while fetching user messages", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch user messages"
        }, { status: 500 })
    }
}