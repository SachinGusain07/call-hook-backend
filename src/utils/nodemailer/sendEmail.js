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