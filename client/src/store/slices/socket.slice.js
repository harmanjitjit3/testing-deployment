import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setConnected } = socketSlice.actions;
export default socketSlice.reducer;
