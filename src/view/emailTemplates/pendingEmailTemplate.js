export const pendingTemplate = (userName, userEmail) => `
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
    <h2>Dear ${userName},</h2>

    <p>Thank you for registering for <strong>ARTTICON 2026</strong>.</p>

    <p>
      Your registration is currently <strong>under review</strong>.
    </p>

    <p>
      Registered Email:
      <br />
      <strong>${userEmail}</strong>
    </p>

    <p>
      We will notify you once your registration status is updated.
    </p>

    <br />

    <p>
      With warm regards,<br />
      <strong>Ashwani Jaiswal</strong><br />
      Organizing Secretary – ARTTICON 2026<br />
      Sr. Radiation Therapist<br />
      AIIMS Rishikesh
    </p>
  </div>
`;
