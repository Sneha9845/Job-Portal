import { NextResponse } from "next/server";
import { readDb, writeDb } from "../../../lib/storage";
import { sendSMS } from "../../../lib/otp";

export const dynamic = 'force-dynamic';

// GET: List all workers
export async function GET() {
    const db = readDb();
    return NextResponse.json(db.workers);
}

// PUT: Admin assigns a job to a worker
export async function PUT(request: Request) {
    const { workerId, assignmentDetails } = await request.json();

    if (!workerId) {
        return NextResponse.json({ error: "Missing workerId" }, { status: 400 });
    }

    const db = readDb();
    const workerIndex = db.workers.findIndex((w: any) => w.id === workerId);

    if (workerIndex === -1) {
        return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    // Update worker
    // Update worker
    if (assignmentDetails) {
        db.workers[workerIndex].assignedJobId = assignmentDetails.jobId;
        db.workers[workerIndex].assignmentDetails = assignmentDetails;
    } else {
        // Unassign / Delete Assignment
        db.workers[workerIndex].assignedJobId = null;
        db.workers[workerIndex].assignmentDetails = null;
    }

    writeDb(db);

    // Send Notifications (Email & SMS)
    const worker = db.workers[workerIndex];
    if (worker) {
        const { name, phone, email } = worker;

        // 1. Send SMS (Existing)
        if (phone) {
            const message = `Dear ${name}, you have been assigned a job! Location: ${assignmentDetails.location}. Contact Guide: ${assignmentDetails.guideName} (${assignmentDetails.guidePhone}).`;
            await sendSMS(phone, message);
        }

        // 2. Send Email (NEW)
        if (email) {
            const { sendAssignmentEmail } = require("../../../lib/email");
            await sendAssignmentEmail(email, name, assignmentDetails);
        }
    }

    return NextResponse.json({ success: true, worker: db.workers[workerIndex] });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: "Missing worker ID" }, { status: 400 });
    }

    const db = readDb();
    const initialLength = db.workers.length;
    db.workers = db.workers.filter((w: any) => w.id !== id);

    if (db.workers.length === initialLength) {
        return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    writeDb(db);
    return NextResponse.json({ success: true });
}
