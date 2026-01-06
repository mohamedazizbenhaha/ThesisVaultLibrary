const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local because we don't have dotenv
const envPath = path.join(__dirname, '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');

// Match DATABASE_URL with or without quotes
const match = envFile.match(/DATABASE_URL=['"]?([^'"]\S+)['"]?/);
const DATABASE_URL = match ? match[1] : null;

if (!DATABASE_URL) {
    console.error('DATABASE_URL not found in .env.local');
    console.log('File Content (Trunated):', envFile.substring(0, 50));
    process.exit(1);
}

const sql = neon(DATABASE_URL);

async function migrate() {
    try {
        console.log('Adding author_roles column...');
        await sql`ALTER TABLE theses ADD COLUMN IF NOT EXISTS author_roles TEXT[] DEFAULT '{}'`;
        console.log('Migration successful!');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
