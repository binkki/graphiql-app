import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import SignUp from "../../routes/_auth.signup";

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
  useTranslation: () => ({
    t: (key: string) => key,
    ready: true,
    i18n: {
      resolvedLanguage: "en",
    },
  }),
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

describe("Signup Component", () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    const router = createMemoryRouter([{ path: "/", element: ui }]);
    return render(<RouterProvider router={router} />);
  };

  it("renders SignUp component", () => {
    renderWithRouter(<SignUp />);
    screen.debug();
  });

  it("handles email change", () => {
    renderWithRouter(<SignUp />);
    const emailInput = screen.getByPlaceholderText(
      "E-mail Address",
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");
  });

  it("shows error for invalid email format", () => {
    renderWithRouter(<SignUp />);
    const emailInput = screen.getByPlaceholderText(
      "E-mail Address",
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    expect(screen.getByText("error_invalid_email_format")).toBeInTheDocument();
  });
});
