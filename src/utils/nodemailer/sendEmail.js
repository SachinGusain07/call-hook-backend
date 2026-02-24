// // mailer.js
// import nodemailer from 'nodemailer';
// import 'dotenv/config'; // Automatically loads .env variables
// import { generateTemplate } from '../../view/emailTemplates/regestrationEmailTemplate.js';

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });


// export const sendMail = async (userEmail, userName) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"My Company"`,
//       to: userEmail,
//       subject: `Welcome ${userName}!`,
//       html: generateTemplate(userName , userEmail),
//     });

//     console.log(`✅ Email sent to: ${userEmail} | ID: ${info.messageId}`);
//     return { success: true };
//   } catch (error) {
//     console.error(`❌ Error for ${userEmail}:`, error.message);
//     return { success: false, error: error.message };
//   }
// };


// mailer.js
import nodemailer from 'nodemailer';
import 'dotenv/config';

import { generateTemplate } from '../../view/emailTemplates/regestrationEmailTemplate.js';
import { confirmationTemplate } from '../../view/emailTemplates/welcome.template.js';
import { pendingTemplate } from '../../view/emailTemplates/pendingEmailTemplate.js';
import { cancelTemplate } from '../../view/emailTemplates/cancelEmailTemplate.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async (userEmail, userName, type = 'registration') => {
  let subject = '';
  let html = '';

  // 👉 TEMPLATE SELECTION
  switch (type) {
    case 'registration':
      subject = 'ARTTICON 2026 – Registration Received';
      html = generateTemplate(userName, userEmail);
      break;

    case 'confirmation':
      subject = 'ARTTICON 2026 – Registration Confirmed';
      html = confirmationTemplate(userName, userEmail);
      break;

    case 'pending':
      subject = 'ARTTICON 2026 – Registration Pending';
      html = pendingTemplate(userName, userEmail);
      break;

    case 'cancel':
      subject = 'ARTTICON 2026 – Registration Cancelled';
      html = cancelTemplate(userName, userEmail);
      break;

    default:
      throw new Error('Invalid email type');
  }

  try {
    const info = await transporter.sendMail({
      from: `"ARTTICON 2026" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      html,
    });

    console.log(`✅ Email sent | ${type} | ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Email error:`, error.message);
    return { success: false, error: error.message };
  }
};
