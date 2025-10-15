import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRequestsThunk,
  fetchRequestByIdThunk,
  approveRequestThunk,
  rejectRequestThunk,
  fetchUserRequestsThunk,
} from "../thunks/request.thunk";

const initialState = {
  requests: [],
  requestDetail: null,
  loading: false,
  buttonLoading: false,
  error: null,
  userRequests: [],
};

const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    clearRequestDetail: (state) => {
      state.requestDetail = null;
      state.error = null;
    },
    updateRequestRealtime: (state, action) => {
      const req = action.payload;
      if (!req || !req._id) return;

      state.requests = (state.requests || []).map((r) =>
        r._id === req._id ? req : r
      );

      if (!state.requests.some((r) => r._id === req._id)) {
        state.requests.unshift(req);
      }

      if (state.requestDetail && state.requestDetail._id === req._id) {
        state.requestDetail = req;
      }
    },
    updateUserRequests: (state, action) => {
      const req = action.payload;
      if (!req || !req._id) return;

      state.userRequests = (state.userRequests || []).map((r) =>
        r._id === req._id ? req : r
      );

      if (!state.userRequests.some((r) => r._id === req._id)) {
        state.userRequests.unshift(req);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Requests
      .addCase(fetchRequestsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload.requests;
      })
      .addCase(fetchRequestsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchRequestByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.requestDetail = action.payload;
      })
      .addCase(fetchRequestByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Fetch user requests
      .addCase(fetchUserRequestsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRequestsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userRequests = action.payload;
      })
      .addCase(fetchUserRequestsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve
      .addCase(approveRequestThunk.pending, (state) => {
        state.buttonLoading = true;
        state.error = null;
      })
      .addCase(approveRequestThunk.fulfilled, (state, action) => {
        state.buttonLoading = false;
      })
      .addCase(approveRequestThunk.rejected, (state, action) => {
        state.buttonLoading = false;
        state.error = action.payload;
      })

      // Reject
      .addCase(rejectRequestThunk.pending, (state) => {
        state.buttonLoading = true;
        state.error = null;
      })
      .addCase(rejectRequestThunk.fulfilled, (state, action) => {
        state.buttonLoading = false;
      })
      .addCase(rejectRequestThunk.rejected, (state, action) => {
        state.buttonLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRequestDetail, updateRequestRealtime, updateUserRequests } =
  requestSlice.actions;
export default requestSlice.reducer;
