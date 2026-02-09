// app/api/workers/register/route.ts
import { NextResponse } from "next/server";
import { readDb, writeDb } from "../../../../lib/storage";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const { name, phone, email, skill, location } = await request.json();
    if (!name || !phone || !email || !skill || !location) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = readDb();

    // Check if worker already exists
    const existing = db.workers.find((w: any) => w.phone === phone);
    if (existing) {
        return NextResponse.json({ error: "Worker already registered" }, { status: 400 });
    }

    // Direct Register (Skipping OTP for now to match Frontend)
    const newWorker = {
        name,
        phone,
        email,
        skill,
        location,
        id: Date.now().toString(),
        assignedJobId: null,
        assignmentDetails: null
    };

    db.workers.push(newWorker);
    writeDb(db);

    return NextResponse.json({ message: "Worker registered successfully", worker: newWorker }, { status: 200 });
}
