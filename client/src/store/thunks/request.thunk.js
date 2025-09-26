import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "@/lib/axios";

export const fetchRequestByIdThunk = createAsyncThunk(
  "requests/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/requests/detail/${id}`, {
        withCredentials: true,
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch request"
      );
    }
  }
);

export const fetchRequestsThunk = createAsyncThunk(
  "requests/fetchRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/requests`, {
        withCredentials: true,
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch requests"
      );
    }
  }
);


export const approveRequestThunk = createAsyncThunk(
  "requests/approveRequest",
  async ({ requestId, type }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `/requests/${requestId}/approve`,
        { withCredentials: true }
      );
      return response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to approve request"
      );
    }
  }
);


export const rejectRequestThunk = createAsyncThunk(
  "requests/rejectRequest",
  async ({ requestId, type, message }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `/requests/${requestId}/reject`,
        { message },
        { withCredentials: true }
      );
      return response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reject request"
      );
    }
  }
);
