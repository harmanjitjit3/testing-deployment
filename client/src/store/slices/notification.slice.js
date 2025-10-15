import { createSlice } from "@reduxjs/toolkit";
import { fetchNotificationsThunk } from "../thunks/notification.thunk";

const initialState = {
  notifications: [],
  loadingInitial: false,
  loadingMore: false,
  error: null,
  page: 1,
  hasMore: true,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.loadingInitial = true;
        } else {
          state.loadingMore = true;
        }
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loadingInitial = false;
        state.loadingMore = false;

        if (action.payload.pagination.page > 1) {
          state.notifications = [
            ...state.notifications,
            ...action.payload.data,
          ];
        } else {
          state.notifications = action.payload.data;
        }

        state.page = action.payload.pagination.page;
        state.hasMore = action.payload.pagination.hasMore;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.loadingInitial = false;
        state.loadingMore = false;
        state.error = action.payload;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
