import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import CreateTransaction from "../pages/home-view/create";
import transactionReducer, {
  createTransaction,
} from "../store/transaction-slice/index";
import Swal from "sweetalert2";
import thunk from "redux-thunk";

// Mock SweetAlert
vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn() },
}));

// Mock transaction-slice with importOriginal to partially mock createTransaction
vi.mock("../store/transaction-slice/index", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createTransaction: vi.fn(), // Mock createTransaction function
  };
});

describe("CreateTransaction Component", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { transaction: transactionReducer },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(thunk),
    });
  });

  it("renders Create Transaction form", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateTransaction />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("Create Transaction")).toBeInTheDocument();
    expect(screen.getByLabelText("User ID")).toBeInTheDocument();
  });

  it("updates FormData on input change", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateTransaction />
        </MemoryRouter>
      </Provider>
    );

    const userIdInput = screen.getByLabelText("User ID");
    fireEvent.change(userIdInput, { target: { value: "1" } });
    expect(userIdInput.value).toBe("1");
  });

  it("submits form and displays success message on success", async () => {
    // Mock a successful response for createTransaction
    const createTransactionMock = vi
      .fn()
      .mockResolvedValue({ payload: { message: "Transaction created" } });
    const { createTransaction } = await import(
      "../store/transaction-slice/index"
    );
    createTransaction.mockImplementation(createTransactionMock);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateTransaction />
        </MemoryRouter>
      </Provider>
    );

    const submitButton = screen.getByRole("button", {
      name: /Create Transaction/i,
    });
    fireEvent.click(submitButton);
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "success" })
    );
  });
});
