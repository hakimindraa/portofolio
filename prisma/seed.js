require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
    console.log("🌱 Starting seed...");

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();

    try {
        // Create admin user
        const hashedPassword = await bcrypt.hash("admin123", 12);

        await client.query(`
      INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 'admin@hakim.com', $1, 'Admin', 'admin', NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);

        console.log("✅ Admin user created: admin@hakim.com");

        // Create initial settings
        const settings = [
            { key: "name", value: "Hakim" },
            { key: "title", value: "Photo Editor" },
            { key: "location", value: "Tanjungpinang" },
            { key: "email", value: "hakim@example.com" },
            { key: "whatsapp", value: "6283137412551" },
            { key: "instagram", value: "hakimlesmna" },
        ];

        for (const setting of settings) {
            await client.query(`
        INSERT INTO "Setting" (id, key, value)
        VALUES (gen_random_uuid(), $1, $2)
        ON CONFLICT (key) DO UPDATE SET value = $2
      `, [setting.key, setting.value]);
        }

        console.log("✅ Initial settings created");

        // Create sample testimonials
        await client.query(`
      INSERT INTO "Testimonial" (id, name, role, content, rating, "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), 'Ahmad Rizki', 'Wedding Client', 'Hasil editing foto wedding saya sangat memuaskan! Detail dan warnanya sempurna.', 5, NOW(), NOW()),
        (gen_random_uuid(), 'Siti Nurhaliza', 'Portrait Client', 'Foto portrait yang dihasilkan sangat profesional. Recommended!', 5, NOW(), NOW())
    `);

        console.log("✅ Sample testimonials created");

        console.log("\n🎉 Seed completed!");
        console.log("\n📧 Login credentials:");
        console.log("   Email: admin@hakim.com");
        console.log("   Password: admin123");

    } finally {
        client.release();
        await pool.end();
    }
}

main().catch(console.error);
