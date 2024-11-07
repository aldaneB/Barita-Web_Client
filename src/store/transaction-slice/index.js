//Create transaction slice

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  hasError: false,
  transactions: [],
};

//TODO:implement create transaction function
//TODO:implement delete transaction function
export const getTransactions = createAsyncThunk(
  "/get-transactions",
  async () => {
    try {
      const response = await axios.get(
        "https://localhost:7075/api/v1/Transaction/get-transactions"
      );
      //   console.log("response" + response.data);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }
);

export const getFilteredTransactions = createAsyncThunk(
  "get-filtered-transactions",
  async ({ filter, rejectWithValue }) => {
    // console.log("Filter" + filter);
    try {
      const response = await axios.post(
        "https://localhost:7075/api/v1/Transaction/get-filtered-transactions",
        filter
      );
      return response.data;
    } catch (err) {
      if (err.response.data || err.response) {
        return rejectWithValue(err.response.data || err.response);
      }
      return rejectWithValue("Unexpeted error!");
    }
  }
);
const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransaction: (state, action) => {
      state.transactions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        console.log(action.payload);
        (state.isLoading = false),
          (state.hasError = false),
          (state.transactions = action.payload);
      })
      .addCase(getTransactions.rejected, (state) => {
        // console.log(state);
        (state.isLoading = false),
          (state.hasError = true),
          (state.transactions = []);
      })
      .addCase(getFilteredTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFilteredTransactions.fulfilled, (state, action) => {
        // console.log("fullfilled action" + action);
        (state.isLoading = false),
          (state.hasError = false),
          (state.transactions = action.payload);
      })
      .addCase(getFilteredTransactions.rejected, (state) => {
        (state.isLoading = false),
          (state.hasError = true),
          (state.transactions = []);
      });
  },
});

export const { setTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
