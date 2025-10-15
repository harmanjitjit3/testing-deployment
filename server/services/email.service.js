import SibApiV3Sdk from "sib-api-v3-sdk";
import { newUser } from "../emails/newUser.js";
import { welcomeUser } from "../emails/welcomeUser.js";
import { fileRequest } from "../emails/fileRequest.js";
import { fileApproved } from "../emails/fileApproved.js";
import { fileRejected } from "../emails/fileRejected.js";
import { accountApproved } from "../emails/accountApproved.js";
import { accountRejected } from "../emails/accountRejected.js";

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

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

export const sendEmail = async (to, subject, templateName, variables = {}) => {
  const html = renderTemplate(templateName, variables);
  try {
    const sendSmtpEmail = {
      sender: { name: "xCHnG Notifications", email: process.env.SMTP_SENDER },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
