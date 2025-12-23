import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all work steps
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM "WorkStep" ORDER BY "order" ASC, "createdAt" DESC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching work steps:", error);
        return NextResponse.json({ error: "Failed to fetch work steps" }, { status: 500 });
    }
}

// POST create new work step
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, icon, color, order, active } = body;

        const result = await pool.query(
            `INSERT INTO "WorkStep" (id, title, description, icon, color, "order", active, "createdAt", "updatedAt")
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
             RETURNING *`,
            [title, description, icon || "MessageSquare", color || "from-teal-400 to-cyan-400", order || 0, active !== false]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("Error creating work step:", error);
        return NextResponse.json({ error: "Failed to create work step" }, { status: 500 });
    }
}

// PUT update work step
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, title, description, icon, color, order, active } = body;

        const result = await pool.query(
            `UPDATE "WorkStep" 
             SET title = $1, description = $2, icon = $3, color = $4, "order" = $5, active = $6, "updatedAt" = NOW()
             WHERE id = $7
             RETURNING *`,
            [title, description, icon, color, order, active, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Work step not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating work step:", error);
        return NextResponse.json({ error: "Failed to update work step" }, { status: 500 });
    }
}

// DELETE work step
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Work step ID required" }, { status: 400 });
        }

        await pool.query('DELETE FROM "WorkStep" WHERE id = $1', [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting work step:", error);
        return NextResponse.json({ error: "Failed to delete work step" }, { status: 500 });
    }
}
