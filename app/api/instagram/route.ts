import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET active instagram posts for public display
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM "InstagramPost" WHERE active = true ORDER BY "order" ASC, "createdAt" DESC LIMIT 6'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching instagram posts:", error);
        return NextResponse.json({ error: "Failed to fetch instagram posts" }, { status: 500 });
    }
}
