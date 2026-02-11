import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'complaints.json');

// Ensure data directory and file exist
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'));
}
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '[]');
}

export async function GET() {
    const data = fs.readFileSync(dbPath, 'utf8');
    return NextResponse.json(JSON.parse(data));
}

export async function POST(request: Request) {
    const complaint = await request.json();
    const data = fs.readFileSync(dbPath, 'utf8');
    const complaints = JSON.parse(data);

    const newComplaint = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...complaint
    };

    complaints.push(newComplaint);
    fs.writeFileSync(dbPath, JSON.stringify(complaints, null, 2));

    return NextResponse.json(newComplaint);
}
