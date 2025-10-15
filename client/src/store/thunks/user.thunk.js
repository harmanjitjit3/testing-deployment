import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "@/lib/axios.js";
import toast from "react-hot-toast";

export const signupUserThunk = createAsyncThunk(
  "auth/signup",
  async (
    { username, email, phone, locality, password },
    { rejectWithValue }
  ) => {
    try {
      const res = await API.post("/auth/signup", {
        username,
        email,
        phone,
        locality,
        password,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  }
);

export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/login", {
        identifier,
        password,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  "auth/logout",
  async (rejectWithValue) => {
    try {
      const res = await API.post("/auth/logout");
      return res.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  }
);

export const checkAuthThunk = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/auth/me");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Not authenticated" }
      );
    }
  }
);
