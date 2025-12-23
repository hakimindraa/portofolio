import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all blog posts
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM "BlogPost" ORDER BY "createdAt" DESC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

// POST create new blog post
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, excerpt, content, category, coverImage, published, readTime } = body;

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const result = await pool.query(
            `INSERT INTO "BlogPost" (id, title, slug, excerpt, content, category, "coverImage", published, "readTime", "createdAt", "updatedAt")
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
             RETURNING *`,
            [title, slug, excerpt, content, category, coverImage || null, published || false, readTime || 5]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}

// PUT update blog post
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, title, excerpt, content, category, coverImage, published, readTime } = body;

        if (!id) {
            return NextResponse.json({ error: "Post ID required" }, { status: 400 });
        }

        // Build dynamic update query for partial updates
        const updates: string[] = [];
        const values: (string | number | boolean | null)[] = [];
        let paramIndex = 1;

        if (title !== undefined) {
            updates.push(`title = $${paramIndex++}`);
            values.push(title);
        }
        if (excerpt !== undefined) {
            updates.push(`excerpt = $${paramIndex++}`);
            values.push(excerpt);
        }
        if (content !== undefined) {
            updates.push(`content = $${paramIndex++}`);
            values.push(content);
        }
        if (category !== undefined) {
            updates.push(`category = $${paramIndex++}`);
            values.push(category);
        }
        if (coverImage !== undefined) {
            updates.push(`"coverImage" = $${paramIndex++}`);
            values.push(coverImage || null);
        }
        if (published !== undefined) {
            updates.push(`published = $${paramIndex++}`);
            values.push(published);
        }
        if (readTime !== undefined) {
            updates.push(`"readTime" = $${paramIndex++}`);
            values.push(readTime);
        }

        updates.push(`"updatedAt" = NOW()`);
        values.push(id);

        const query = `UPDATE "BlogPost" SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`;
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}

// DELETE blog post
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Post ID required" }, { status: 400 });
        }

        await pool.query('DELETE FROM "BlogPost" WHERE id = $1', [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
