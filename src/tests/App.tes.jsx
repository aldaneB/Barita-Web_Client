import { act } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import App from "../App";
import { checkAuth } from "../store/auth-slice/index";
import { ThemeProvider } from "@material-tailwind/react";

// Mock checkAuth action
vi.mock("../store/auth-slice/index", () => ({
  checkAuth: vi.fn(),
}));

describe("App Component", () => {
  let rootContainer;
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: (
          state = { isAuthenticated: false, isLoading: false },
          action
        ) => {
          switch (action.type) {
            case "auth/checkAuth":
              return { ...state, isLoading: false };
            default:
              return state;
          }
        },
      },
    });

    rootContainer = document.createElement("div");
    document.body.appendChild(rootContainer);
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.removeChild(rootContainer);
  });

  it("dispatches checkAuth on mount", async () => {
    const root = createRoot(rootContainer);

    await act(async () => {
      root.render(
        <ThemeProvider>
          <Provider store={store}>
            <MemoryRouter>
              <App />
            </MemoryRouter>
          </Provider>
        </ThemeProvider>
      );
    });

    expect(store.getState().auth.isLoading).toBe(false);
    expect(checkAuth).toHaveBeenCalled();
  });

  it("renders loading message when isLoading is true", async () => {
    store = configureStore({
      reducer: {
        auth: (state = { isAuthenticated: false, isLoading: true }, action) =>
          state,
      },
    });

    const root = createRoot(rootContainer);

    await act(async () => {
      root.render(
        <ThemeProvider>
          <Provider store={store}>
            <MemoryRouter>
              <App />
            </MemoryRouter>
          </Provider>
        </ThemeProvider>
      );
    });

    expect(rootContainer.textContent).toContain("Loading...");
  });

  it("renders HomeLayout when authenticated", async () => {
    store = configureStore({
      reducer: {
        auth: (state = { isAuthenticated: true, isLoading: false }, action) =>
          state,
      },
    });

    const root = createRoot(rootContainer);

    await act(async () => {
      root.render(
        <ThemeProvider>
          <Provider store={store}>
            <MemoryRouter>
              <App />
            </MemoryRouter>
          </Provider>
        </ThemeProvider>
      );
    });

    expect(rootContainer.textContent).not.toContain("Loading...");
    expect(rootContainer.textContent).toContain("Protected Content");
  });

  it("renders AuthLayout when not authenticated", async () => {
    store = configureStore({
      reducer: {
        auth: (state = { isAuthenticated: false, isLoading: false }, action) =>
          state,
      },
    });

    const root = createRoot(rootContainer);

    await act(async () => {
      root.render(
        <ThemeProvider>
          <Provider store={store}>
            <MemoryRouter initialEntries={["/auth/login"]}>
              <App />
            </MemoryRouter>
          </Provider>
        </ThemeProvider>
      );
    });

    expect(rootContainer.textContent).toContain("Login");
  });
});
