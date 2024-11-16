
// CheckAuth.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CheckAuth } from "../components/auth-component/check-auth";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { act } from "react";

// Mock useNavigate from react-router-dom
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: vi.fn(),
}));

describe("CheckAuth Component", () => {
  let mockNavigate;
  let rootContainer;

  beforeEach(() => {
    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    rootContainer = document.createElement("div");
    document.body.appendChild(rootContainer);
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.removeChild(rootContainer);
  });

  it("renders children when user is authenticated", () => {
    const root = createRoot(rootContainer);
    act(() => {
      root.render(
        <CheckAuth isAuthenticated={true}>
          <div data-testid="protected-content">Protected Content</div>
        </CheckAuth>
      );
    });

    const content = rootContainer.querySelector("[data-testid='protected-content']");
    expect(content).not.toBeNull();
    expect(content.textContent).toBe("Protected Content");

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("navigates to login page when user is not authenticated", async () => {
    const root = createRoot(rootContainer);
    act(() => {
      root.render(
        <CheckAuth isAuthenticated={false}>
          <div data-testid="protected-content">Protected Content</div>
        </CheckAuth>
      );
    });

    // Wait briefly to ensure the useEffect runs
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Now check that navigate was called with "auth/login"
    expect(mockNavigate).toHaveBeenCalledWith("auth/login");

    const content = rootContainer.querySelector("[data-testid='protected-content']");
    expect(content).toBeNull();
  });
});