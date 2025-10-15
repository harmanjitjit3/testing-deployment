export const welcomeUser = ({ username, date = Date.now() }) => {
  const link = `${process.env.CLIENT_URI}`;
  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: 'Poppins', Arial, sans-serif;
        background-color: #f5f6f8;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background-color: #171717;
        color: white;
        text-align: center;
        padding: 20px;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        padding: 24px;
        color: #333;
        line-height: 1.6;
      }
      .btn {
        display: inline-block;
        background-color: #2563eb;
        color: white !important;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 500;
        margin-top: 15px;
      }
      .footer {
        background-color: #f8f9fb;
        text-align: center;
        color: #666;
        font-size: 13px;
        padding: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Welcome to xCHnG</div>
      <div class="content">
        <h3>Hi ${username},</h3>
        <p>Welcome to <b>xCHnG</b> - we’re excited to have you onboard!</p>
        <p>Your registration has been received successfully on <b>${date}</b>.  
        Your account is currently <b>under review</b> and will be activated soon after verification.</p>
        <p>Once approved, you’ll receive a confirmation email and get full access to all features of xCHnG.</p>
        <a href="${link}" target="_blank" class="btn">Visit xCHnG</a>
        
      </div>
      <div class="footer">
        © 2025 xCHnG
      </div>
    </div>
  </body>
</html>`;
};
