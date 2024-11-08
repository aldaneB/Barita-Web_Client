//Create User Auth Slice

//TODO:Implement checkAuth function to user auth checking
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 *Login user function
 */
export const loginUser = createAsyncThunk(
  "/api/v1/Auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://localhost:7075/api/v1/Auth/login",
        formData
      );
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state) {
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload.error;
      });
  },
});
export const { loginSuccess } = authSlice.actions;
export default authSlice.reducer;
