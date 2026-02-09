import nodemailer from 'nodemailer';

/**
 * Email Service
 * Uses Nodemailer to send real emails if credentials are provided in .env.local
 * Falls back to Ethereal.email for a "Working Demo" if no credentials found.
 */

async function getTransporter() {
    // 1. Use user provided credentials if available
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    // 2. Fallback to Ethereal.email for a WORKING DEMO
    console.log(`[DEMO MODE] No email credentials found. Creating a temporary Ethereal account...`);
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
}

export async function sendAssignmentEmail(to: string, workerName: string, details: any) {
    const transporter = await getTransporter();
    const isTestAccount = !process.env.EMAIL_USER;

    const mailOptions = {
        from: `"Worker Job Portal" <${process.env.EMAIL_USER || 'demo@jobportal.com'}>`,
        to: to,
        subject: `Important: New Job Assignment Details - ${details.jobId}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Job Assignment</h2>
                <p>Dear <strong>${workerName}</strong>,</p>
                <p>You have been assigned to a new job. Please find the details below:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background-color: #f8fafc;">
                        <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">Reporting Location</th>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;">${details.location}</td>
                    </tr>
                    <tr>
                        <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">Who to Meet</th>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;">${details.guideName}</td>
                    </tr>
                    <tr style="background-color: #f8fafc;">
                        <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">Supervisor Contact</th>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;">${details.guidePhone}</td>
                    </tr>
                    <tr>
                        <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">Reporting Time</th>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;">${details.reportingTime}</td>
                    </tr>
                    <tr style="background-color: #f8fafc;">
                        <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">Salary</th>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;">${details.salary}</td>
                    </tr>
                </table>

                <div style="background-color: #eff6ff; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
                    <p style="margin: 0; color: #1e40af;"><strong>Instructions:</strong> ${details.instructions}</p>
                </div>

                <p>Please report on time. If you have any questions, contact the supervisor directly.</p>
                <p style="color: #64748b; font-size: 12px; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                    This is an automated message from Govind's Worker Portal.
                </p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);

        if (isTestAccount) {
            console.log(`\n==================================================`);
            console.log(`[WORKING DEMO] Email sent via Ethereal!`);
            console.log(`To: ${to}`);
            console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            console.log(`==================================================\n`);
        } else {
            console.log(`[EMAIL SENT] Message ID: ${info.messageId} to ${to}`);
        }

        return info;
    } catch (error) {
        console.error(`[EMAIL ERROR] Failed to send to ${to}:`, error);
        throw error;
    }
}
