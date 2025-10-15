import { transporter, fromEmail } from "../config/email.config.js";
import { newUser } from "../emails/newUser.js";
import { welcomeUser } from "../emails/welcomeUser.js";
import { fileRequest } from "../emails/fileRequest.js";
import { fileApproved } from "../emails/fileApproved.js";
import { fileRejected } from "../emails/fileRejected.js";
import { accountApproved } from "../emails/accountApproved.js";
import { accountRejected } from "../emails/accountRejected.js";

const templates = {
  newUser, //username, email
  fileRequest, //username, action, fileName, tags
  fileApproved, //activity, username
  fileRejected, //activity, username
  accountApproved, //username
  accountRejected, //username
  welcomeUser, // username, date
};

function renderTemplate(templateName, variables = {}) {
  const templateFn = templates[templateName];
  if (!templateFn) {
    throw new Error(`Email template '${templateName}' not found.`);
  }

  return templateFn(variables);
}

export async function sendEmail(to, subject, templateName, variables = {}) {
  try {
    const html = renderTemplate(templateName, variables);

    const mailOptions = {
      from: fromEmail,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(`Failed to send email (${templateName}):`, err.message);
  }
}