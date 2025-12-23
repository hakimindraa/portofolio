import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all pricing plans
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM "PricingPlan" ORDER BY "order" ASC, "createdAt" DESC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching pricing plans:", error);
        return NextResponse.json({ error: "Failed to fetch pricing plans" }, { status: 500 });
    }
}

// POST create new pricing plan
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, price, period, description, icon, color, features, popular, order, active } = body;

        // Features should be stored as JSON string
        const featuresJson = typeof features === 'string' ? features : JSON.stringify(features);

        const result = await pool.query(
            `INSERT INTO "PricingPlan" (id, name, price, period, description, icon, color, features, popular, "order", active, "createdAt", "updatedAt")
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
             RETURNING *`,
            [name, price, period || "per project", description, icon || "Zap", color || "from-gray-400 to-gray-500", featuresJson, popular || false, order || 0, active !== false]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("Error creating pricing plan:", error);
        return NextResponse.json({ error: "Failed to create pricing plan" }, { status: 500 });
    }
}

// PUT update pricing plan
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, price, period, description, icon, color, features, popular, order, active } = body;

        // Features should be stored as JSON string
        const featuresJson = typeof features === 'string' ? features : JSON.stringify(features);

        const result = await pool.query(
            `UPDATE "PricingPlan" 
             SET name = $1, price = $2, period = $3, description = $4, icon = $5, color = $6, features = $7, popular = $8, "order" = $9, active = $10, "updatedAt" = NOW()
             WHERE id = $11
             RETURNING *`,
            [name, price, period, description, icon, color, featuresJson, popular, order, active, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Pricing plan not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating pricing plan:", error);
        return NextResponse.json({ error: "Failed to update pricing plan" }, { status: 500 });
    }
}

// DELETE pricing plan
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Pricing plan ID required" }, { status: 400 });
        }

        await pool.query('DELETE FROM "PricingPlan" WHERE id = $1', [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting pricing plan:", error);
        return NextResponse.json({ error: "Failed to delete pricing plan" }, { status: 500 });
    }
}
