// app/api/jobs/route.ts
import { NextResponse } from "next/server";
import { readDb, writeDb } from "../../../lib/storage";

export const dynamic = 'force-dynamic';

export async function GET() {
    const db = readDb();
    return NextResponse.json(db.jobs);
}

export async function POST(request: Request) {
    const { title, salary, location, time, color, category, phone } = await request.json();

    if (!title || !salary || !location || !time) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = readDb();
    const newJob = {
        id: Date.now(),
        title,
        salary,
        location,
        time,
        color: color || "bg-blue-500 text-blue-700",
        category,
        phone: phone || "+91 9876543210"
    };

    db.jobs.push(newJob);
    writeDb(db);

    return NextResponse.json(newJob, { status: 201 });
}
