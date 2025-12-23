import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET published blog posts for public display
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM "BlogPost" WHERE published = true ORDER BY "createdAt" DESC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
    }
}
