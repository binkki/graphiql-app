import { render, screen, waitFor } from "@testing-library/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { describe, expect, it, vi } from "vitest";
import AuthCheck from "../../../components/AuthCheck/AuthCheck";

vi.mock("firebase/auth", async (importOriginal) => {
  const actual: Record<string, unknown> = await importOriginal();
  return {
    ...actual,
    onAuthStateChanged: vi.fn(),
  };
});

vi.mock("@remix-run/react", () => ({
  useNavigate: vi.fn(),
}));

describe("AuthCheck", () => {
  it("renders loading state initially", async () => {
    (
      onAuthStateChanged as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(
      (_auth: unknown, callback: (user: User | null) => void) => {
        // Simulate a delay to ensure loading state is rendered
        setTimeout(() => callback(null), 100);
        return () => {};
      },
    );

    render(<AuthCheck>Authenticated Content</AuthCheck>);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders children when user is authenticated", async () => {
    (
      onAuthStateChanged as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(
      (_auth: unknown, callback: (user: User | null) => void) => {
        callback({ uid: "123" } as User);
        return () => {};
      },
    );

    render(<AuthCheck>Authenticated Content</AuthCheck>);

    await waitFor(() =>
      expect(screen.getByText("Authenticated Content")).toBeInTheDocument(),
    );
  });
});
