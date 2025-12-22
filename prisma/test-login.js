require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

async function testLogin() {
    console.log("🔍 Testing login...\n");

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();

    try {
        // Get admin user
        const result = await client.query('SELECT id, email, password, name FROM "User" WHERE email = $1', ['admin@hakim.com']);

        if (result.rows.length === 0) {
            console.log("❌ User not found!");
            return;
        }

        const user = result.rows[0];
        console.log("👤 User found:", user.email);
        console.log("   Name:", user.name);
        console.log("   Password hash:", user.password.substring(0, 20) + "...");

        // Test password
        const testPassword = "admin123";
        const isValid = await bcrypt.compare(testPassword, user.password);

        console.log("\n🔑 Password test:", isValid ? "✅ VALID" : "❌ INVALID");

    } finally {
        client.release();
        await pool.end();
    }
}

testLogin().catch(console.error);
