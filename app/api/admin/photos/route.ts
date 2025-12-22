import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

// GET all photos (public)
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT id, title, category, "imageUrl", featured, "order" FROM "Photo" ORDER BY "order" ASC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching photos:", error);
        return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
    }
}

// POST create new photo
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, category, imageUrl, featured } = body;

        if (!title || !category || !imageUrl) {
            return NextResponse.json(
                { error: "Title, category, and imageUrl are required" },
                { status: 400 }
            );
        }

        // Get max order
        const maxOrderResult = await pool.query('SELECT MAX("order") as max FROM "Photo"');
        const maxOrder = maxOrderResult.rows[0]?.max || 0;

        const result = await pool.query(
            `INSERT INTO "Photo" (id, title, category, "imageUrl", featured, "order", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, title, category, "imageUrl", featured, "order"`,
            [title, category, imageUrl, featured || false, maxOrder + 1]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("Error creating photo:", error);
        return NextResponse.json({ error: "Failed to create photo" }, { status: 500 });
    }
}

// DELETE a photo
export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Photo ID is required" }, { status: 400 });
        }

        await pool.query('DELETE FROM "Photo" WHERE id = $1', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting photo:", error);
        return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
    }
}

// PUT update a photo
export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, title, category, imageUrl, featured, order } = body;

        if (!id) {
            return NextResponse.json({ error: "Photo ID is required" }, { status: 400 });
        }

        const result = await pool.query(
            `UPDATE "Photo" 
       SET title = COALESCE($1, title), 
           category = COALESCE($2, category), 
           "imageUrl" = COALESCE($3, "imageUrl"), 
           featured = COALESCE($4, featured),
           "order" = COALESCE($5, "order"),
           "updatedAt" = NOW()
       WHERE id = $6
       RETURNING id, title, category, "imageUrl", featured, "order"`,
            [title, category, imageUrl, featured, order, id]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating photo:", error);
        return NextResponse.json({ error: "Failed to update photo" }, { status: 500 });
    }
}
