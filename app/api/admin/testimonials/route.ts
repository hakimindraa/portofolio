import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET all testimonials
export async function GET() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
    }
}

// POST create new testimonial
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const { name, role, content, rating, avatar } = body;

        const testimonial = await prisma.testimonial.create({
            data: { name, role, content, rating: rating || 5, avatar },
        });

        return NextResponse.json(testimonial, { status: 201 });
    } catch (error) {
        console.error("Error creating testimonial:", error);
        return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
    }
}

// PUT update testimonial
export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const { id, name, role, content, rating, avatar } = body;

        const testimonial = await prisma.testimonial.update({
            where: { id },
            data: { name, role, content, rating, avatar },
        });

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error("Error updating testimonial:", error);
        return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
    }
}

// DELETE testimonial
export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        await prisma.testimonial.delete({ where: { id: id! } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
    }
}
