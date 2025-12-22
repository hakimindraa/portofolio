import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

// GET all settings
export async function GET() {
    try {
        const result = await pool.query('SELECT key, value FROM "Setting"');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

// POST/PUT settings (upsert)
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const settings = await request.json();

        // Upsert each setting
        for (const [key, value] of Object.entries(settings)) {
            await pool.query(
                `INSERT INTO "Setting" (id, key, value)
         VALUES (gen_random_uuid(), $1, $2)
         ON CONFLICT (key) DO UPDATE SET value = $2`,
                [key, String(value)]
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving settings:", error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
