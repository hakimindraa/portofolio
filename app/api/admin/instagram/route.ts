import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all instagram posts
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM "InstagramPost" ORDER BY "order" ASC, "createdAt" DESC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching instagram posts:", error);
        return NextResponse.json({ error: "Failed to fetch instagram posts" }, { status: 500 });
    }
}

// POST create new instagram post
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { imageUrl, caption, likes, comments, order, active } = body;

        const result = await pool.query(
            `INSERT INTO "InstagramPost" (id, "imageUrl", caption, likes, comments, "order", active, "createdAt", "updatedAt")
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
             RETURNING *`,
            [imageUrl, caption || null, likes || 0, comments || 0, order || 0, active !== false]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("Error creating instagram post:", error);
        return NextResponse.json({ error: "Failed to create instagram post" }, { status: 500 });
    }
}

// PUT update instagram post
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, imageUrl, caption, likes, comments, order, active } = body;

        const result = await pool.query(
            `UPDATE "InstagramPost" 
             SET "imageUrl" = $1, caption = $2, likes = $3, comments = $4, "order" = $5, active = $6, "updatedAt" = NOW()
             WHERE id = $7
             RETURNING *`,
            [imageUrl, caption, likes, comments, order, active, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Instagram post not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating instagram post:", error);
        return NextResponse.json({ error: "Failed to update instagram post" }, { status: 500 });
    }
}

// DELETE instagram post
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Instagram post ID required" }, { status: 400 });
        }

        await pool.query('DELETE FROM "InstagramPost" WHERE id = $1', [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting instagram post:", error);
        return NextResponse.json({ error: "Failed to delete instagram post" }, { status: 500 });
    }
}
