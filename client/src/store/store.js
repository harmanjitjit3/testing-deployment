import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/user.slice.js";
import requestSlice from "./slices/request.slice.js";
import notificationSlice from "./slices/notification.slice.js";
import socketSlice from "./slices/socket.slice.js";

export const store = configureStore({
  reducer: {
    auth: userSlice,
    requests: requestSlice,
    notifications: notificationSlice,
    socket: socketSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
