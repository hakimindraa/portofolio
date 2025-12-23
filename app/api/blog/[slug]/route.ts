import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET single blog post by slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const result = await pool.query(
            'SELECT * FROM "BlogPost" WHERE slug = $1 AND published = true',
            [slug]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
    }
}
