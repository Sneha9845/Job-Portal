const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
// Handle case where file doesn't exist
if (!fs.existsSync(envPath)) {
    console.error(".env.local file not found at:", envPath);
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
    if (line.startsWith('#')) return;
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        envVars[key] = value;
    }
});

const uri = envVars.MONGODB_URI;

if (!uri) {
    console.error("MONGODB_URI not found in .env.local");
    process.exit(1);
}

console.log("Testing connection to:", uri.split('@')[1] || "HIDDEN"); // simple mask

const opts = {
    bufferCommands: false,
};

mongoose.connect(uri, opts)
    .then(() => {
        console.log("Successfully connected to MongoDB!");
        process.exit(0);
    })
    .catch(err => {
        console.error("Failed to connect:", err);
        process.exit(1);
    });
