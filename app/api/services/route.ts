import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET active services for public display
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM "Service" WHERE active = true ORDER BY "order" ASC, "createdAt" DESC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}
