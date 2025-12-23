import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET testimonials for public display
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
