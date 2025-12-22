import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [photos, testimonials, posts, messages, unreadMessages] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM "Photo"'),
            pool.query('SELECT COUNT(*) FROM "Testimonial"'),
            pool.query('SELECT COUNT(*) FROM "BlogPost"'),
            pool.query('SELECT COUNT(*) FROM "ContactMessage"'),
            pool.query('SELECT COUNT(*) FROM "ContactMessage" WHERE read = false'),
        ]);

        return NextResponse.json({
            photos: parseInt(photos.rows[0].count),
            testimonials: parseInt(testimonials.rows[0].count),
            posts: parseInt(posts.rows[0].count),
            messages: parseInt(messages.rows[0].count),
            unreadMessages: parseInt(unreadMessages.rows[0].count),
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
