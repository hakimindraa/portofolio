import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET public settings
export async function GET() {
    try {
        const result = await pool.query('SELECT key, value FROM "Setting"');

        const settings: Record<string, string> = {};
        result.rows.forEach((row: { key: string; value: string }) => {
            settings[row.key] = row.value;
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}
