import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "@/lib/axios.js";


export const fetchNotificationsThunk = createAsyncThunk(
  "notifications/fetchAll",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await API.get(
        `/notifications?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);
