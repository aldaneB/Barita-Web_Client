/**
 * Create gloabal reducer and maintain slices
 *
 */

import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./transaction-slice";

const store = configureStore({
  reducer: {
    transaction: transactionReducer,
  },
});

export default store;
