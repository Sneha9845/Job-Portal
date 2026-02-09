const fetch = require('node-fetch');

async function testFlow() {
    console.log("1. Fetching workers...");
    const res = await fetch("http://localhost:3000/api/workers");
    const workers = await res.json();
    console.log("Workers found:", workers.length);

    if (workers.length === 0) {
        console.error("No workers found! Seed failed.");
        return;
    }

    const workerId = workers[0].id;
    console.log("2. Assigning job to worker:", workerId);

    const assignRes = await fetch("http://localhost:3000/api/workers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            workerId: workerId,
            assignmentDetails: {
                jobId: "job_123",
                location: "Test Site",
                guideName: "Supervisor John",
                guidePhone: "1234567890",
                reportingTime: "9 AM",
                instructions: "Wear helmet",
                salary: "500"
            }
        })
    });

    const assignData = await assignRes.json();
    console.log("Assignment Response:", assignData);

    if (assignData.success) {
        console.log("3. Verifying assignment persistence...");
        const res2 = await fetch("http://localhost:3000/api/workers");
        const workers2 = await res2.json();
        const updatedWorker = workers2.find(w => w.id === workerId);

        if (updatedWorker.assignedJobId === "job_123") {
            console.log("SUCCESS: Worker updated correctly!");
        } else {
            console.error("FAILURE: Worker data mismatch", updatedWorker);
        }
    } else {
        console.error("FAILURE: API returned error");
    }
}

testFlow();
