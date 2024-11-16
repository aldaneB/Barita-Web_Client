//Create User Auth Slice

//TODO:Implement checkAuth function to user auth checking
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiEndpoint from "../../authorization/auth";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
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

/**
 * Check if user is authenticated from web api
 */
export const checkAuth = createAsyncThunk(
  "/check-auth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiEndpoint.get("Auth/check-auth");
      console.log(response.data);
      return response.data;
    } catch (ex) {
      return rejectWithValue(ex.message);
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
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});
export const { loginSuccess } = authSlice.actions;
export default authSlice.reducer;
