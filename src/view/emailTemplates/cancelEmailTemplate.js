export const cancelTemplate = (userName, userEmail) => `
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

    <p>
      We regret to inform you that your registration for
      <strong>ARTTICON 2026</strong> has been <strong>cancelled</strong>.
    </p>

    <p>
      Registered Email:
      <br />
      <strong>${userEmail}</strong>
    </p>

    <p>
      If you believe this was a mistake or need further assistance,
      please feel free to contact us.
    </p>

    <br />

    <p>
      With warm regards,<br />
      <strong>Ashwani Jaiswal</strong><br />
      Organizing Secretary – ARTTICON 2026<br />
      Sr. Radiation Therapist<br />
      AIIMS Rishikesh<br />
      E-mail:
      <a href="mailto:artticon2026@gmail.com">
        artticon2026@gmail.com
      </a>
    </p>
  </div>
`;
