import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./email.config.js";
import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }];

	try {
        console.log("Attempting to send verification email to:", email);
        
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify your email",
			// FIX: Use global replace for template variables
			html: VERIFICATION_EMAIL_TEMPLATE.replace(/{verificationCode}/g, verificationToken),
			category: "Email Verification",
		});

		console.log("Verification email sent successfully", response);
        return response; // ADDED: Return the response
	} catch (error) {
		console.error(`Error sending verification email:`, error);
		throw new Error(`Error sending verification email: ${error.message}`); // FIX: Use error.message
	}
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        console.log("Attempting to send welcome email to:", email);
        
        const welcomeHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Welcome to Our App!</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(to right, #af4c89ff, #45a049); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Welcome to Our App!</h1>
                </div>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <p>Hello ${name},</p>
                    <p>Welcome to our platform! Your account has been successfully verified.</p>
                    <p>We're excited to have you on board and look forward to serving you.</p>
                    <p>If you have any questions, feel free to reach out to our support team.</p>
                    <p>Best regards,<br>coca-cola</p>
                </div>
            </body>
            </html>
        `;

        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome to Our App!",
            html: welcomeHtml,
        });

        console.log("Welcome email sent successfully", response);
        return response;
    } catch (error) {
        console.error(`Error sending welcome email:`, error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

	try {
        console.log("Attempting to send password reset email to:", email);
        console.log("Reset URL:", resetURL);
        
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			// FIX: Use global replace for template variables
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(/{resetURL}/g, resetURL),
			category: "Password Reset",
		});

        console.log("Password reset email sent successfully", response);
        return response; // ADDED: Return the response
	} catch (error) {
		console.error(`Error sending password reset email:`, error);
		throw new Error(`Error sending password reset email: ${error.message}`); // FIX: Use error.message
	}
};

export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
        console.log("Attempting to send reset success email to:", email);
        
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset success email sent successfully", response);
        return response; // ADDED: Return the response
	} catch (error) {
		console.error(`Error sending password reset success email:`, error);
		throw new Error(`Error sending password reset success email: ${error.message}`); // FIX: Use error.message
	}
};