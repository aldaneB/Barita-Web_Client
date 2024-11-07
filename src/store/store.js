/**
 * Create gloabal reducer and maintain slices
 *
 */

import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./transaction-slice";
import authReducer from "./auth-slice";

const store = configureStore({
  reducer: {
    transaction: transactionReducer,
    auth: authReducer,
  },
});

export default store;
