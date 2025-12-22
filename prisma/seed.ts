import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const admin = await prisma.user.upsert({
        where: { email: "admin@hakim.com" },
        update: {},
        create: {
            email: "admin@hakim.com",
            password: hashedPassword,
            name: "Admin",
            role: "admin",
        },
    });

    console.log("✅ Admin user created:", admin.email);

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
        await prisma.setting.upsert({
            where: { key: setting.key },
            update: { value: setting.value },
            create: setting,
        });
    }

    console.log("✅ Initial settings created");

    // Create sample photos
    const photos = [
        { title: "Portrait Session 1", category: "Portrait", imageUrl: "/images/p1.jpg", order: 1 },
        { title: "Wedding Moment", category: "Wedding", imageUrl: "/images/p2.jpg", order: 2 },
        { title: "Nature Beauty", category: "Nature", imageUrl: "/images/p3.jpg", order: 3 },
    ];

    for (const photo of photos) {
        await prisma.photo.create({ data: photo });
    }

    console.log("✅ Sample photos created");

    // Create sample testimonials
    const testimonials = [
        {
            name: "Ahmad Rizki",
            role: "Wedding Client",
            content: "Hasil editing foto wedding saya sangat memuaskan! Detail dan warnanya sempurna.",
            rating: 5,
        },
        {
            name: "Siti Nurhaliza",
            role: "Portrait Client",
            content: "Foto portrait yang dihasilkan sangat profesional. Recommended!",
            rating: 5,
        },
    ];

    for (const testimonial of testimonials) {
        await prisma.testimonial.create({ data: testimonial });
    }

    console.log("✅ Sample testimonials created");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
