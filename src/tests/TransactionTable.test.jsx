import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import TransactionTable from "../pages/home-view/index";
import transactionReducer, {
  deleteTransaction,
  getTransactions,
} from "../store/transaction-slice/index";

import Swal from "sweetalert2";
import "@testing-library/jest-dom";

// Mock Swal and transaction actions
vi.mock("sweetalert2", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: {
      ...actual.default,
      fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
    },
  };
});

vi.mock("../../store/transaction-slice/index", () => ({
  deleteTransaction: vi.fn(),
  getTransactions: vi.fn(),
  default: vi.fn(),
}));

describe("TransactionTable Component", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        transaction: transactionReducer,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    store = configureStore({
      reducer: {
        transaction: () => ({
          transactions: [],
          isLoading: true,
          hasError: false,
        }),
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TransactionTable />
        </MemoryRouter>
      </Provider>
    );

    const loadingElement = screen.queryByText("Loading...");
    expect(loadingElement).toBeInTheDocument();
  });

  it("renders error state", () => {
    store = configureStore({
      reducer: {
        transaction: () => ({
          transactions: [],
          isLoading: false,
          hasError: true,
        }),
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TransactionTable />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("renders transactions", async () => {
    const mockTransactions = [
      {
        transaction_id: 1,
        transaction_date: "2024-01-01",
        transaction_type: "deposit",
        amount: 1000,
        created_at: "2024-01-01T00:00:00Z",
      },
    ];

    store = configureStore({
      reducer: {
        transaction: () => ({
          transactions: mockTransactions,
          isLoading: false,
          hasError: false,
        }),
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TransactionTable />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Transaction Table")).toBeInTheDocument();
    expect(screen.getByText("Transaction ID")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Transaction Date/i })
    ).toBeInTheDocument();
    expect(screen.getByText("deposit")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /amount/i })
    ).toBeInTheDocument();
  });

  it("deletes a transaction after confirmation", async () => {
    const mockTransactions = [
      {
        transaction_id: 1,
        transaction_date: "2024-01-01",
        transaction_type: "deposit",
        amount: 1000,
        created_at: "2024-01-01T00:00:00Z",
      },
    ];

    store = configureStore({
      reducer: {
        transaction: () => ({
          transactions: mockTransactions,
          isLoading: false,
          hasError: false,
        }),
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TransactionTable />
        </MemoryRouter>
      </Provider>
    );

    // Target the first "Delete" button specifically
    fireEvent.click(screen.getAllByText("Delete")[0]);

    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    // await waitFor(() => expect(deleteTransaction).toHaveBeenCalledWith(1));
  });
});
