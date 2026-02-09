import { NextResponse } from "next/server";
import { readDb, writeDb } from "../../../../lib/storage";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
        return NextResponse.json({ error: "Missing phone or OTP" }, { status: 400 });
    }

    const storedOtpData = (global as any).otpStore?.[phone];

    if (!storedOtpData) {
        return NextResponse.json({ error: "OTP expired or not found" }, { status: 400 });
    }

    if (storedOtpData.otp !== otp) {
        return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (Date.now() > storedOtpData.expires) {
        return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // OTP Verified - Create Worker
    const pendingData = (global as any).pendingWorker?.[phone];

    if (!pendingData) {
        return NextResponse.json({ error: "Registration session expired" }, { status: 400 });
    }

    // Save to DB
    const db = readDb();
    const newWorker = {
        ...pendingData,
        assignedJobId: null,
        assignmentDetails: null
    };

    db.workers.push(newWorker);
    writeDb(db);

    // Cleanup
    delete (global as any).pendingWorker[phone];
    delete (global as any).otpStore[phone];

    return NextResponse.json({ message: "Worker verified and registered", worker: newWorker });
}
