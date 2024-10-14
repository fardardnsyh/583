import { dbConnect } from "@/db/dbConnect";
import UserModel from "@/model/user";
import { usernameSchema } from "@/schemas";
import { NextResponse } from "next/server";

// Force Next.js to treat this API route as dynamic
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    // Connect to the database
    await dbConnect();

    try {
        // Parse the request URL for query parameters
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get("username")
        };

        // Validate the query params using the Zod schema
        const result = usernameSchema.safeParse(queryParams);

        // If username validation failed
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return NextResponse.json(
                {
                    success: false,
                    message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters"
                },
                { status: 400 }
            );
        }

        const { username } = result.data;

        // Find a verified user by username
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username already exists!"
                },
                { status: 400 }
            );
        }

        // Username is available
        return NextResponse.json(
            {
                success: true,
                message: "Username is available."
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error while checking username", error);
        return NextResponse.json(
            { success: false, message: "Error while checking username" },
            { status: 500 }
        );
    }
}
