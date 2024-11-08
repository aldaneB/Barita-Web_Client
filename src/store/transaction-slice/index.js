//Create transaction slice

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiEndpoint from "../../authorization/auth";

const initialState = {
  isLoading: false,
  hasError: false,
  transactions: [],
};

export const getTransactions = createAsyncThunk(
  "/get-transactions",
  async () => {
    try {
      const response = await apiEndpoint.get("/Transaction/get-transactions");
      return response.data.data;
    } catch (err) {
      console.error(err);
    }
  }
);

/**
 * Create transaction slice
 */
export const createTransaction = createAsyncThunk(
  "/create-transaction",
  async (transaction, { rejectWithValue }) => {
    try {
      const response = await apiEndpoint.post(
        "/Transaction/create-transaction",
        transaction
      );
      return response.data.data;
    } catch (err) {
      if (err.response.data.data || err.response) {
        return rejectWithValue(err.response.data || err.response);
      }
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Delete transaction by Id
 */
export const deleteTransaction = createAsyncThunk(
  "/transaction_id",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiEndpoint.delete(`/Transaction/${id}`);
      return response.data.data;
    } catch (err) {
      if (err.response.data || err.response) {
        return rejectWithValue(err.response.data || err.response);
      }
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Get filtered transactions
 */
export const getFilteredTransactions = createAsyncThunk(
  "get-filtered-transactions",
  async ({ filter, rejectWithValue }) => {
    // console.log("Filter" + filter);
    try {
      const response = await apiEndpoint.post(
        "/Transaction/get-filtered-transactions",
        filter
      );
      return response.data.data;
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
        (state.isLoading = false),
          (state.hasError = false),
          (state.transactions = action.payload);
      })
      .addCase(getFilteredTransactions.rejected, (state) => {
        (state.isLoading = false),
          (state.hasError = true),
          (state.transactions = []);
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.transactions = state.transactions.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteTransaction.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const { setTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
