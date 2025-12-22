import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all photos for public display
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT id, title, category, "imageUrl" FROM "Photo" ORDER BY "order" ASC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching photos:", error);
        return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
    }
}
