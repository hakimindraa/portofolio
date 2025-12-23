import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

// DELETE - Remove image from Cloudinary
export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const publicId = searchParams.get("publicId");
        const imageUrl = searchParams.get("url");

        // Extract public ID from URL if not provided directly
        let idToDelete = publicId;
        if (!idToDelete && imageUrl) {
            // Extract public ID from Cloudinary URL
            // URL format: https://res.cloudinary.com/xxx/image/upload/v123/portfolio/filename.jpg
            const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
            if (match) {
                idToDelete = match[1];
            }
        }

        if (!idToDelete) {
            return NextResponse.json({ error: "No image identifier provided" }, { status: 400 });
        }

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(idToDelete);

        if (result.result === "ok" || result.result === "not found") {
            return NextResponse.json({ success: true, message: "Image deleted" });
        } else {
            return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
        }
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
    }
}
