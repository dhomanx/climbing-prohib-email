require('dotenv').config();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// --- Configuration ---
const csvFilePath = path.resolve(__dirname, 'tds.csv');
const templatePath = path.resolve(__dirname, 'tds.html');
const emailSubject = 'Request for Suspension of Dalkey Quarry Climbing Prohibition';

// Check for credentials in .env file
if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.SENDER_NAME) {
    console.error('Error: Please set GMAIL_USER, GMAIL_APP_PASSWORD, and SENDER_NAME in a .env file.');
    process.exit(1);
}

async function sendEmails() {
    try {
        // 1. Read the email template and CSV file
        const emailTemplate = fs.readFileSync(templatePath, 'utf8');
        const csvData = fs.readFileSync(csvFilePath, 'utf8');

        // 2. Parse CSV data
        const lines = csvData.trim().split('\n');
        // Trim headers to handle potential whitespace or carriage returns (\r)
        const header = lines.shift().split(',').map(h => h.trim());
        const surnameIndex = header.indexOf('Surname');
        const emailIndex = header.indexOf('Email');

        if (surnameIndex === -1 || emailIndex === -1) {
            throw new Error('CSV must have "Surname" and "Email" columns.');
        }

        const councillors = lines.map(line => {
            const values = line.split(',');
            return {
                surname: values[surnameIndex].trim(),
                email: values[emailIndex].trim(),
            };
        });

        // 3. Set up Nodemailer transporter using Gmail and App Password
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        console.log(`Preparing to send ${councillors.length} emails...`);

        // 4. Loop through councillors and send emails
        for (const councillor of councillors) {
            const personalizedHtml = emailTemplate.replace('[Surname]', councillor.surname);

            const mailOptions = {
                from: `"${process.env.SENDER_NAME}" <${process.env.GMAIL_USER}>`,
                to: councillor.email,
                subject: emailSubject,
                html: personalizedHtml,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Successfully sent email to ${councillor.surname} at ${councillor.email}`);
        }

        console.log('\nAll emails have been sent successfully!');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

sendEmails();
