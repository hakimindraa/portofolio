import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all services
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM "Service" ORDER BY "order" ASC, "createdAt" DESC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}

// POST create new service
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, icon, order, active } = body;

        const result = await pool.query(
            `INSERT INTO "Service" (id, title, description, icon, "order", active, "createdAt", "updatedAt")
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
             RETURNING *`,
            [title, description, icon || "Camera", order || 0, active !== false]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error("Error creating service:", error);
        return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
    }
}

// PUT update service
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, title, description, icon, order, active } = body;

        const result = await pool.query(
            `UPDATE "Service" 
             SET title = $1, description = $2, icon = $3, "order" = $4, active = $5, "updatedAt" = NOW()
             WHERE id = $6
             RETURNING *`,
            [title, description, icon, order, active, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating service:", error);
        return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
    }
}

// DELETE service
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Service ID required" }, { status: 400 });
        }

        await pool.query('DELETE FROM "Service" WHERE id = $1', [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting service:", error);
        return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
    }
}
