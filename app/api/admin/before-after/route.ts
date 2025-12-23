import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all before/after items
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM "BeforeAfterItem" ORDER BY "order" ASC, "createdAt" DESC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching before/after items:", error);
        return NextResponse.json({ error: "Failed to fetch before/after items" }, { status: 500 });
    }
}

// POST create new before/after item
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, beforeImage, afterImage, order, active } = body;

        const result = await pool.query(
            `INSERT INTO "BeforeAfterItem" (id, title, "beforeImage", "afterImage", "order", active, "createdAt", "updatedAt")
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
             RETURNING *`,
            [title, beforeImage, afterImage, order || 0, active !== false]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("Error creating before/after item:", error);
        return NextResponse.json({ error: "Failed to create before/after item" }, { status: 500 });
    }
}

// PUT update before/after item
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, title, beforeImage, afterImage, order, active } = body;

        const result = await pool.query(
            `UPDATE "BeforeAfterItem" 
             SET title = $1, "beforeImage" = $2, "afterImage" = $3, "order" = $4, active = $5, "updatedAt" = NOW()
             WHERE id = $6
             RETURNING *`,
            [title, beforeImage, afterImage, order, active, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Before/after item not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating before/after item:", error);
        return NextResponse.json({ error: "Failed to update before/after item" }, { status: 500 });
    }
}

// DELETE before/after item
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Before/after item ID required" }, { status: 400 });
        }

        await pool.query('DELETE FROM "BeforeAfterItem" WHERE id = $1', [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting before/after item:", error);
        return NextResponse.json({ error: "Failed to delete before/after item" }, { status: 500 });
    }
}
