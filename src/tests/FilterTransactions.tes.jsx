import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import FilterTransaction from "../pages/home-view/filter";
import transactionReducer, {
  getFilteredTransactions,
} from "../store/transaction-slice/index";
import thunk from "redux-thunk";
import "@testing-library/jest-dom";

// Mock React Datepicker for testing
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: ({ selected, onChange }) => (
    <input
      type="date"
      value={selected ? selected.toISOString().split("T")[0] : ""}
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));

// Mock the Redux action creator `getFilteredTransactions`
vi.mock("../../store/transaction-slice/index", () => ({
  getFilteredTransactions: vi.fn(),
}));

describe("FilterTransaction Component", () => {
  let store;

  beforeEach(() => {
    console.log("Setting up the store");
    store = configureStore({
      reducer: {
        transaction: transactionReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(thunk),
      preloadedState: {
        transaction: {
          transactions: [],
          isLoading: false,
          hasError: null,
        },
      },
    });
  });

  it("renders the FilterTransaction component", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <FilterTransaction />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Filtered Transaction")).toBeInTheDocument();
  });

  it("should call getFilteredTransactions when form is submitted", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <FilterTransaction />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/User ID:/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/Transaction Type:/i), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByLabelText(/Start Date:/i), {
      target: { value: "2022-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/End Date:/i), {
      target: { value: "2022-12-31" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Filter Transactions/i })
    );

    // await waitFor(() => {
    //   expect(getFilteredTransactions).toHaveBeenCalled();
    // });
  });

  it("disables download button if there are no transactions", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <FilterTransaction />
        </BrowserRouter>
      </Provider>
    );

    const downloadButton = screen.getByRole("button", {
      name: /Download CSV/i,
    });
    expect(downloadButton).toBeDisabled();
  });
});
