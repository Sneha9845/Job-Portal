import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial DB state
const INITIAL_DB = {
    workers: [],
    jobs: []
};

// Helper to read DB
export function readDb() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2));
        return INITIAL_DB;
    }
    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading DB:", error);
        return INITIAL_DB;
    }
}

// Helper to write DB
export function writeDb(data: any) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error("Error writing DB:", error);
        return false;
    }
}
