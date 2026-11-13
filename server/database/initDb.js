import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

async function initDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL environment variable is missing.');
    console.error('Please add DATABASE_URL to your server/.env file or Railway environment variables.');
    process.exit(1);
  }

  console.log('🔄 Connecting to PostgreSQL database...');
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')
      ? false 
      : { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database successfully.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    console.log('📦 Executing schema.sql (creating tables, indexes, constraints)...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('✅ Schema tables successfully created.');

    console.log('🌱 Executing seed.sql (seeding faculty, courses, platform settings)...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await client.query(seedSql);
    console.log('✅ Seed data successfully populated.');

    client.release();
    await pool.end();

    console.log('================================================================');
    console.log('🎉 DATABASE INITIALIZATION COMPLETE!');
    console.log('All tables, admin accounts, and settings are ready for production.');
    console.log('================================================================');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err.message);
    process.exit(1);
  }
}

initDatabase();
