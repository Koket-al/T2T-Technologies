import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for Gmail
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export const sender = {
    email: process.env.GMAIL_USER,
    name: "COCA-COLA 🍻",
};

// Keep the same interface for easy replacement
export const mailtrapClient = {
    send: async (emailData) => {
        try {
            console.log('Preparing to send email to:', emailData.to);
            
            const mailOptions = {
                from: `"${sender.name}" <${sender.email}>`,
                to: emailData.to.map(recipient => recipient.email).join(', '),
                subject: emailData.subject,
                html: emailData.html,
                // FIXED: Safe check for html before using replace
                text: emailData.text || (emailData.html ? emailData.html.replace(/<[^>]*>/g, '') : 'No content'),
            };

            console.log('Sending email with options:', {
                from: mailOptions.from,
                to: mailOptions.to,
                subject: mailOptions.subject
            });

            const result = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully. Message ID:', result.messageId);
            return result;
        } catch (error) {
            console.error('Error sending email:', error.message);
            throw error;
        }
    }
};