const fetch = require('node-fetch');

async function testRegistration() {
    console.log("1. Registering new worker...");
    const uniquePhone = "999" + Date.now().toString().slice(-7); // Ensure unique
    const res = await fetch("http://localhost:3000/api/workers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "New API Worker",
            phone: uniquePhone,
            skill: "driver",
            location: "Delhi"
        })
    });

    const data = await res.json();
    console.log("Registration Response:", res.status, data);

    if (res.ok) {
        console.log("2. Verifying worker appears in list...");
        const listRes = await fetch("http://localhost:3000/api/workers");
        const workers = await listRes.json();
        const found = workers.find(w => w.phone === uniquePhone);

        if (found) {
            console.log("SUCCESS: Worker found in list!");
        } else {
            console.error("FAILURE: Worker NOT found in list despite success response.");
        }
    } else {
        console.error("FAILURE: Registration failed");
    }
}

testRegistration();
