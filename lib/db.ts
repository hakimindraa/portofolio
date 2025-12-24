import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

console.log("DATABASE_URL exists:", !!connectionString);
console.log("DATABASE_URL starts with:", connectionString?.substring(0, 30));

if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
});

export default pool;
