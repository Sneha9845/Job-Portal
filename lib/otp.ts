// lib/otp.ts
export function generateOTP(): string {
    // Simple 6‑digit numeric OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTP(phone: string, otp: string): Promise<void> {
    console.log(`[SMS SIMULATION] Sending OTP ${otp} to ${phone}`);
}

export async function sendSMS(phone: string, message: string): Promise<void> {
    // NOTE: To send REAL SMS, you would integrate a provider like Twilio, MSG91, or AWS SNS here.
    // Example (Pseudo-code):
    // await fetch('https://api.twilio.com/...', { body: { to: phone, body: message } });

    console.log(`\n==================================================`);
    console.log(`[NOTIFICATION] Sending to ${phone}...`);
    console.log(`Payload: "${message}"`);
    console.log(`Status: Browser Push Notification Triggered`);
    console.log(`==================================================\n`);

    // Trigger browser push notification
    if (typeof window !== 'undefined') {
        // Dispatch custom event for notification
        window.dispatchEvent(new CustomEvent('send-notification', {
            detail: {
                phone,
                message,
                title: 'Job Assignment',
                body: message
            }
        }));
    }
}
