import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all testimonials
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM "Testimonial" ORDER BY "createdAt" DESC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
    }
}

// POST create new testimonial
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, role, content, rating, avatar } = body;

        const result = await pool.query(
            `INSERT INTO "Testimonial" (id, name, role, content, rating, avatar, "createdAt", "updatedAt")
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
             RETURNING *`,
            [name, role, content, rating || 5, avatar || null]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("Error creating testimonial:", error);
        return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
    }
}

// PUT update testimonial
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, role, content, rating, avatar } = body;

        const result = await pool.query(
            `UPDATE "Testimonial" 
             SET name = $1, role = $2, content = $3, rating = $4, avatar = $5, "updatedAt" = NOW()
             WHERE id = $6
             RETURNING *`,
            [name, role, content, rating, avatar, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating testimonial:", error);
        return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
    }
}

// DELETE testimonial
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Testimonial ID required" }, { status: 400 });
        }

        await pool.query('DELETE FROM "Testimonial" WHERE id = $1', [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
    }
}
