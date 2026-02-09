const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/workers';
const REGISTER_URL = 'http://localhost:3000/api/workers/register';

async function verifyEmailFlow() {
    console.log("1. Registering worker with email...");
    const dummyPhone = '98' + Math.floor(Math.random() * 100000000);
    const dummyEmail = `test_${Date.now()}@example.com`;

    const regRes = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Email Tester',
            phone: dummyPhone,
            email: dummyEmail,
            skill: 'Painter',
            location: 'Mumbai'
        })
    });

    if (!regRes.ok) {
        console.error("Registration failed:", await regRes.text());
        return;
    }
    console.log("Success: Worker registered.");

    console.log("2. Fetching worker ID...");
    const listRes = await fetch(BASE_URL);
    const workers = await listRes.json();
    const worker = workers.find(w => w.phone === dummyPhone);

    if (!worker) {
        console.error("Worker not found in DB.");
        return;
    }
    console.log(`Worker ID: ${worker.id}`);

    console.log("3. Assigning job and checking logs for Email trigger...");
    const assignRes = await fetch(BASE_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            workerId: worker.id,
            assignmentDetails: {
                jobId: "Job_101",
                location: "Andheri East",
                guideName: "Mr. Sharma",
                guidePhone: "9123456789",
                reportingTime: "10:00 AM",
                instructions: "Carry ID proof.",
                salary: "₹ 600"
            }
        })
    });

    if (assignRes.ok) {
        console.log("SUCCESS: Assignment API called.");
        console.log("Check the terminal where the Next.js server is running to see the SIMULATING EMAIL SEND log.");
    } else {
        console.error("Assignment failed:", await assignRes.text());
    }
}

verifyEmailFlow();
