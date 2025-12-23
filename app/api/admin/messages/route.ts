import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all messages
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM "ContactMessage" ORDER BY "createdAt" DESC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

// PUT update message (mark as read/replied)
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, read, replied } = body;

        if (!id) {
            return NextResponse.json({ error: "Message ID required" }, { status: 400 });
        }

        // Build dynamic update query
        const updates: string[] = [];
        const values: (string | boolean)[] = [];
        let paramIndex = 1;

        if (typeof read === "boolean") {
            updates.push(`read = $${paramIndex++}`);
            values.push(read);
        }
        if (typeof replied === "boolean") {
            updates.push(`replied = $${paramIndex++}`);
            values.push(replied);
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        values.push(id);
        const query = `UPDATE "ContactMessage" SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`;
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Message not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating message:", error);
        return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
    }
}

// DELETE message
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Message ID required" }, { status: 400 });
        }

        await pool.query('DELETE FROM "ContactMessage" WHERE id = $1', [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting message:", error);
        return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
    }
}
