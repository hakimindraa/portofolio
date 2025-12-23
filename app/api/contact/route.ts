import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// POST - Create new contact message from public form
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
        }

        const result = await pool.query(
            `INSERT INTO "ContactMessage" (id, name, email, subject, message, read, replied, "createdAt")
             VALUES (gen_random_uuid(), $1, $2, $3, $4, false, false, NOW())
             RETURNING *`,
            [name, email, subject || "No Subject", message]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("Error creating contact message:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
