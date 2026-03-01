import nodemailer from 'nodemailer';
import 'dotenv/config';
import { generateTemplate } from '../../view/emailTemplates/regestrationEmailTemplate.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async (userEmail, userName, webhookUrl) => {
  const subject = 'Registration Successful';
  
  // Uses the simplified template with the webhook URL
  const html = generateTemplate(userName, userEmail, webhookUrl);

  try {
    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      html,
    });

    console.log(`✅ Email sent | Registration | ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Email error:`, error.message);
    return { success: false, error: error.message };
  }
};


// Add this to your email utility file
export const sendSubscriptionAlertMail = async (userEmail, userName, reason) => {
  const subject = '⚠️ SignalCall Webhook Alert: Action Required';
  
  const html = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #0A0F2C;">Hello ${userName},</h2>
      <p>Your webhook was triggered, but our system could not process the call.</p>
      <p><strong>Reason:</strong> <span style="color: #FF2FB3;">${reason}</span></p>
      <p>To continue receiving real-time phone alerts, please renew your subscription or upgrade your plan.</p>
      <br />
      <p>Best regards,<br />Digital Astra Labs Support Team</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      html,
    });
    console.log(`✅ Alert Email sent | ${reason} | ${userEmail}`);
  } catch (error) {
    console.error(`❌ Email error:`, error.message);
  }
};