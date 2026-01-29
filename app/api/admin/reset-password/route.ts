import { NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function POST(request: Request) {
    try {
        const { email, resetKey, newPassword } = await request.json();

        // Validate inputs
        if (!email || !resetKey || !newPassword) {
            return NextResponse.json(
                { error: "Email, reset key, dan password baru harus diisi" },
                { status: 400 }
            );
        }

        // Verify reset key
        const validResetKey = process.env.ADMIN_RESET_KEY;
        if (!validResetKey || resetKey !== validResetKey) {
            return NextResponse.json(
                { error: "Reset key tidak valid" },
                { status: 401 }
            );
        }

        // Check if user exists
        const userResult = await pool.query(
            'SELECT id, email FROM "User" WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return NextResponse.json(
                { error: "Email tidak ditemukan" },
                { status: 404 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        await pool.query(
            'UPDATE "User" SET password = $1, "updatedAt" = NOW() WHERE email = $2',
            [hashedPassword, email]
        );

        return NextResponse.json({
            success: true,
            message: "Password berhasil diubah",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat reset password" },
            { status: 500 }
        );
    }
}
