export const fileApproved = ({ username, type, fileName, fileId }) => {
  const link = `${process.env.CLIENT_URI}/app/file-detail/${fileId}`;
  const reqType = type === "upload" ? "Upload" : "Download";
  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: "Poppins", Arial, sans-serif;
        background: #f5f6f8;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background: #171717;
        color: #fff;
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
        background: #2563eb;
        color: #fff;
        padding: 10px 20px;
        border-radius: 8px;
        text-decoration: none;
        margin-top: 12px;
        display: inline-block;
      }
      .footer {
        background: #f8f9fb;
        text-align: center;
        color: #666;
        font-size: 13px;
        padding: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">xCHnG</div>
      <div class="content">
        <h3>${reqType} Request Approved</h3>
        <p>Hi ${username},</p>
        <p>Your ${reqType.toLowerCase()} request for file <b>${fileName}</b> has been approved!</p>
        <p>You can now access your file from the dashboard.</p>
        <a href="${link}" target="_blank" class="btn">View File</a>
      </div>
      <div class="footer">© 2025 xCHnG</div>
    </div>
  </body>
</html>

`;
};
