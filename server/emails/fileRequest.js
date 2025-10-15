export const fileRequest = ({ username, type, fileName, requestId, date = Date.now() }) => {
  const link = `${process.env.CLIENT_URI}/admin/request-detail/${requestId}`;
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
        <h3>
          New File ${type} Request
        </h3>
        <p>User <b>${username}</b> has requested to <b>${type}</b> a file.</p>
        <p>
          <b>File Name:</b> ${fileName}<br />
          <b>Date:</b> ${date}
        </p>
        <a href="${link}" target="_blank" class="btn"
          >Review Request</a
        >
      </div>
      <div class="footer">© 2025 xCHnG</div>
    </div>
  </body>
</html>
`;
};
