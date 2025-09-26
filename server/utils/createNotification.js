import Notification from "../models/notification.model.js";
import {
  sendNotificationToAdmins,
  sendNotificationToUser,
} from "../socket/socket.js";

export const createNotification = async (props) => {
  try {
    const { user, roleFor, type, message, request } = props;

    const notification = await Notification.create({
      user,
      roleFor,
      type,
      message,
      request,
    });

    const populated = await Notification.findById(notification._id).populate({
      path: "request",
      populate: [
        { path: "user", select: "-password" },
        { path: "admin", select: "username phone email locality" },
      ],
    });
    
    const payload = {
      event: "requestUpdated",
      notification: populated,
      userId: String(user),
      timestamp: new Date().toISOString(),
    };

    sendNotificationToAdmins(payload);
    sendNotificationToUser(String(user), payload);

    return populated;
  } catch (err) {
    console.error("createNotification failed:", err);
    throw err;
  }
};
