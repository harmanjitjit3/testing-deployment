import { sendEmail } from "../services/email.service.js";
import User from "../models/user.model.js";

export const sendAdminEmails = async (
  subject,
  templateName,
  variables = {}
) => {
  try {
    const admins = await User.find({ role: "admin", status: "approved" });
    if (!admins.length) {
      console.log("No admins found for email notification.");
      return;
    }

    for (const admin of admins) {
      await sendEmail(admin.email, subject, templateName, variables);
    }

    console.log(`Admin notification sent to ${admins.length} admins`);
  } catch (err) {
    console.error("Error sending admin notifications:", err.message);
  }
};
