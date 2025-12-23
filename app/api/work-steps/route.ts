import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET active work steps for public display
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM "WorkStep" WHERE active = true ORDER BY "order" ASC, "createdAt" DESC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching work steps:", error);
        return NextResponse.json({ error: "Failed to fetch work steps" }, { status: 500 });
    }
}
