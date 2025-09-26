import { createSlice } from "@reduxjs/toolkit";
import {
  logoutUserThunk,
  loginUserThunk,
  signupUserThunk,
  checkAuthThunk,
} from "../thunks/user.thunk";

const initialState = {
  userProfile: null,
  buttonLoading: false, 
  isAuthorized: false,
  loading: true,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log(action.payload)
      state.userProfile = action.payload;
      state.isAuthorized = !!action.payload;
    },
    clearUser: (state) => {
      state.userProfile = null;
      state.isAuthorized = false;
    },
    logout: (state) => {
      state.userProfile = null;
      state.isAuthorized = false;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = !!action.payload;
    },
    setButtonLoading: (state, action) => {
      state.buttonLoading = !!action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // 🔹 login
      .addCase(loginUserThunk.pending, (state) => {
        state.buttonLoading = true;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.buttonLoading = false;
        state.isAuthorized = true;
        state.userProfile = action.payload?.user || null;
      })
      .addCase(loginUserThunk.rejected, (state) => {
        state.buttonLoading = false;
      })

      // 🔹 signup
      .addCase(signupUserThunk.pending, (state) => {
        state.buttonLoading = true;
      })
      .addCase(signupUserThunk.fulfilled, (state, action) => {
        state.buttonLoading = false;
        state.isAuthorized = true;
        state.userProfile = action.payload?.user || null;
      })
      .addCase(signupUserThunk.rejected, (state) => {
        state.buttonLoading = false;
      })

      // 🔹 logout
      .addCase(logoutUserThunk.pending, (state) => {
        state.buttonLoading = true;
        state.loading = true;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.buttonLoading = false;
        state.loading = false;
        state.isAuthorized = false;
        state.userProfile = null;
      })
      .addCase(logoutUserThunk.rejected, (state) => {
        state.loading = false;
        state.buttonLoading = false;
      })

      // checkAuth
      .addCase(checkAuthThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthorized = true;
        state.userProfile = action.payload?.user || action.payload || null;
      })
      .addCase(checkAuthThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthorized = false;
        state.userProfile = null;
      });
  },
});

export const { setUser, clearUser, logout, setLoading, setButtonLoading } =
  userSlice.actions;
export default userSlice.reducer;
