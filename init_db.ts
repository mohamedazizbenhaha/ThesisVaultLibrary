
import { setupAdminsTable, sql } from './lib/db';

async function main() {
    console.log('Initializing database...');
    try {
        await setupAdminsTable();
        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        // End the connection so the script exits
        // sql.end() isn't exposed directly from neon client usuallly in simple usage, 
        // but the node process will exit if no pending handles. 
        // Neon serverless might keep it open, so we might need to force exit.
        process.exit(0);
    }
}

main();
