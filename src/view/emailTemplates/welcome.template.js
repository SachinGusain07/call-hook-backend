export const confirmationTemplate = (userName, userEmail) => `
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
      Thank you for registering!
    </p>

    <p>
      This is your <strong>confirmation email</strong>.
    </p>

    <p>
      Your registration has been confirmed using the email address:
      <br />
      <strong>${userEmail}</strong>
    </p>

    <p>
      We look forward to welcoming you at
      <strong>ARTTICON 2026, Rishikesh</strong>.
    </p>

    <br />

    <p>
      With warm regards,<br />
      <strong>Ashwani Jaiswal</strong><br />
      Organizing Secretary – ARTTICON 2026<br />
      Sr. Radiation Therapist<br />
      AIIMS Rishikesh<br />
      Mob: (+91) 9454883456<br />
      E-mail:
      <a href="mailto:artticon2026@gmail.com">
        artticon2026@gmail.com
      </a>
    </p>
  </div>
`;
