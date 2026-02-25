// emailTemplate.js
export const generateTemplate = (userName, userEmail, webhookUrl) => {
  return `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      max-width: 600px;
      margin: auto;
      border: 1px solid #e0e0e0;
      padding: 24px;
      background-color: #ffffff;
      color: #333;
      line-height: 1.6;
    ">
      <h2 style="color: #1a1a1a;">Dear ${userName},</h2>

      <p>
        Your registration has been successfully completed.
      </p>

      <p>
        <strong>Account Email:</strong> ${userEmail}
      </p>

      <div style="
        background-color: #f9f9f9;
        padding: 15px;
        border: 1px dashed #cccccc;
        margin: 20px 0;
      ">
        <p style="margin-top: 0; font-weight: bold;">Your Webhook URL:</p>
        <code style="color: #007bff; word-break: break-all;">${webhookUrl}</code>
      </div>

      <p>
        You can now use this URL to integrate your services. Your subscription is currently being processed.
      </p>

      <br />

      <p>
        With warm regards,<br />
        <strong>Support Team</strong><br />
        Registration Management System
      </p>
    </div>
  `;
};