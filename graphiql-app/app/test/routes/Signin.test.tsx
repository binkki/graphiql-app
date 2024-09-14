import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import SignIn from "../../routes/_auth.signin";

vi.mock("firebase/auth", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    signInWithEmailAndPassword: vi.fn(),
    sendEmailVerification: vi.fn(),
    getAuth: vi.fn().mockReturnValue({
      currentUser: null,
    }),
    onAuthStateChanged: vi.fn((auth, callback) => {
      callback(null);
      return () => {};
    }),
    signOut: vi.fn(),
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../../firebase", () => ({
  auth: {
    onAuthStateChanged: vi.fn((callback) => {
      callback(null);
      return () => {};
    }),
    signOut: vi.fn(),
  },
}));

describe("SignIn Component", () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    const router = createMemoryRouter([{ path: "/", element: ui }]);
    return render(<RouterProvider router={router} />);
  };

  it("renders SignIn component", () => {
    renderWithRouter(<SignIn />);
    expect(screen.getByText("signin")).toBeInTheDocument();
  });

  it("handles email change", () => {
    renderWithRouter(<SignIn />);
    const emailInput = screen.getByPlaceholderText(
      "E-mail Address",
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");
  });

  it("handles password change", () => {
    renderWithRouter(<SignIn />);
    const passwordInput = screen.getByPlaceholderText(
      "Password",
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    expect(passwordInput.value).toBe("Password123!");
  });

  it("shows error for invalid email format", () => {
    renderWithRouter(<SignIn />);
    const emailInput = screen.getByPlaceholderText(
      "E-mail Address",
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
  });

  it("shows error for invalid password format", () => {
    renderWithRouter(<SignIn />);
    const passwordInput = screen.getByPlaceholderText(
      "Password",
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "123" } });
    expect(
      screen.getByText(
        "Password must include at least one letter, one digit and one special symbol",
      ),
    ).toBeInTheDocument();
  });

  it("shows error for invalid credentials", async () => {
    (signInWithEmailAndPassword as vi.Mock).mockRejectedValue(
      new Error("Invalid credentials"),
    );

    renderWithRouter(<SignIn />);
    const emailInput = screen.getByPlaceholderText(
      "E-mail Address",
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      "Password",
    ) as HTMLInputElement;
    const signInButton = screen.getByText("submit");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Sorry, your account was not found. Please check if the data you entered is correct or re-register.",
        ),
      ).toBeInTheDocument();
    });
  });
});
