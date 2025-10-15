export const accountRejected = ({ username, reason = "Not specified" }) => {
  const link = `${process.env.CLIENT_URI}`;
  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: 'Poppins', Arial, sans-serif; background: #f5f6f8; margin: 0; }
      .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); overflow: hidden; }
      .header { background: #171717; color: #fff; text-align: center; padding: 20px; font-size: 24px; font-weight: 600; }
      .content { padding: 24px; color: #333; line-height: 1.6; }
      .btn { background: #2563eb; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin-top: 12px; display: inline-block; }
      .footer { background: #f8f9fb; text-align: center; color: #666; font-size: 13px; padding: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">xCHnG</div>
      <div class="content">
        <h3>Account Request Rejected</h3>
        <p>Hi ${username},</p>
        <p>Your account request was rejected.</p>
        <p><b>Reason:</b> ${reason}</p>
        <p>You can update your details and request again later.</p>
        <a href="${link}" target="_blank" class="btn">Visit xCHnG</a>
      </div>
      <div class="footer">© 2025 xCHnG</div>
    </div>
  </body>
</html>
`;
};
