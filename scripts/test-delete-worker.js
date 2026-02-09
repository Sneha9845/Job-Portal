const fetch = require('node-fetch');

const BASE_URL = 'http://127.0.0.1:3000/api/workers';
const REGISTER_URL = 'http://127.0.0.1:3000/api/workers/register';

async function testDelete() {
    // 1. Register a dummy worker
    const dummyPhone = '9999999999' + Math.floor(Math.random() * 1000);
    console.log(`Registering worker with phone: ${dummyPhone}`);

    const regRes = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Delete Test Worker',
            phone: dummyPhone,
            skill: 'helper',
            location: 'Test City'
        })
    });

    if (!regRes.ok) {
        console.error('Registration failed:', await regRes.text());
        return;
    }

    // Get the ID
    const listRes = await fetch(BASE_URL);
    const workers = await listRes.json();
    const worker = workers.find(w => w.phone === dummyPhone);

    if (!worker) {
        console.error('Worker not found after registration');
        return;
    }

    console.log(`Worker registered with ID: ${worker.id}`);

    // 2. Delete the worker
    console.log(`Deleting worker ${worker.id}...`);
    const delRes = await fetch(`${BASE_URL}?id=${worker.id}`, {
        method: 'DELETE'
    });

    if (delRes.ok) {
        console.log('Delete request successful');
    } else {
        console.error('Delete request failed:', await delRes.text());
        return;
    }

    // 3. Verify deletion
    const verifyRes = await fetch(BASE_URL);
    const verifyWorkers = await verifyRes.json();
    const exists = verifyWorkers.find(w => w.id === worker.id);

    if (!exists) {
        console.log('SUCCESS: Worker deleted successfully.');
    } else {
        console.error('FAILURE: Worker still exists after deletion.');
    }
}

testDelete();
