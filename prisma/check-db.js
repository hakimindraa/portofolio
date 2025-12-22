require("dotenv").config();
const { Pool } = require("pg");

async function checkDb() {
    console.log("🔍 Checking database...\n");

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();

    try {
        // Check users
        const users = await client.query('SELECT id, email, name, role FROM "User"');
        console.log("👤 Users in database:");
        console.table(users.rows);

        // Check settings
        const settings = await client.query('SELECT key, value FROM "Setting"');
        console.log("\n⚙️ Settings in database:");
        console.table(settings.rows);

        // Check testimonials
        const testimonials = await client.query('SELECT id, name, role FROM "Testimonial"');
        console.log("\n⭐ Testimonials in database:");
        console.table(testimonials.rows);

    } finally {
        client.release();
        await pool.end();
    }
}

checkDb().catch(console.error);
