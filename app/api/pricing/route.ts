import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET active pricing plans for public display
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM "PricingPlan" WHERE active = true ORDER BY "order" ASC, "createdAt" DESC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching pricing plans:", error);
        return NextResponse.json({ error: "Failed to fetch pricing plans" }, { status: 500 });
    }
}
