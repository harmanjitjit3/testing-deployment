import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query =
      req.user.role === "user"
        ? { user: req.user._id, roleFor: "user" }
        : { $or: [{ roleFor: "admin" }, { user: req.user._id }] };

    if (req.user?.approvedAt){
      query.createdAt = { $gte: req.user?.approvedAt }
    } else {
      query.createdAt = { $gte: req.user?.updatedAt }
    }

    const notifications = await Notification.find(query)
      .populate({
        path: "request",
        populate: [{ path: "file" }],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: skip + notifications.length < total,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
