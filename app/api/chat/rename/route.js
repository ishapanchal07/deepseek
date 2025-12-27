import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User not authenticated",
            });
        }

        const { chaId, name } = await req.json();

        await Chat.findOneAndUpdate(
            { _id: chaId, userId },
            { name }
        );

        return NextResponse.json({
            success: true,
            message: "Chat name updated successfully",
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || "Something went wrong",
        }, { status: 500 });
    }
}
