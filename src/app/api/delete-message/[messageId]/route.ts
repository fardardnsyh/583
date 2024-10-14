import { auth } from "@/auth";
import { dbConnect } from "@/db/dbConnect";
import UserModel from "@/model/user";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    await dbConnect();
    try {
        const {messageId} = params
        const session = await auth();
        const user = session?.user;

        if (!session || !user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized access"
            }, { status: 401 });
        }

        const updatedMessages = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );
        console.log("Updated messages : ", updatedMessages)

        if (updatedMessages.modifiedCount == 0) {
            return NextResponse.json({
                success: false,
                message: "Message not found or it's already deleted"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Message deleted successfully"
        }, { status: 200 });
    } catch (error) {
        console.log("Error while deleting message", error)
        return NextResponse.json({
            success: false,
            message: "Error while deleting message"
        }, { status: 500 });
    }
}