import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET all messages
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

// POST create new message (public - from contact form)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        const newMessage = await prisma.contactMessage.create({
            data: { name, email, subject, message },
        });

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        console.error("Error creating message:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}

// PUT update message (mark as read/replied)
export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const { id, read, replied } = body;

        const message = await prisma.contactMessage.update({
            where: { id },
            data: {
                ...(typeof read === "boolean" && { read }),
                ...(typeof replied === "boolean" && { replied }),
            },
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error("Error updating message:", error);
        return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
    }
}

// DELETE message
export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        await prisma.contactMessage.delete({ where: { id: id! } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting message:", error);
        return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
    }
}
