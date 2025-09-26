import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "@/lib/axios.js";

export const addNewAdminThunk = createAsyncThunk(
  "admin/addNewAdmin",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await API.post("/admin/add-admin", {
        email,
      });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add admin");
    }
  }
);

export const findAdminThunk = createAsyncThunk(
  "admin/findAdmin",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await API.post("admin/find-admin", {
        email,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to find user");
    }
  }
);
