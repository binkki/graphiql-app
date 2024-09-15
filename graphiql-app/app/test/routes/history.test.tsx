import { render, screen } from "@testing-library/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import History from "../../routes/history";
import { getHistoryFromLocalStorage } from "../../utils/localStorage";

vi.mock("../../utils/localStorage", () => ({
  getHistoryFromLocalStorage: vi.fn(),
}));

vi.mock("firebase/auth");

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockUser: User = {
  uid: "123",
  emailVerified: false,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: "",
  tenantId: null,
  delete: vi.fn(),
  getIdToken: vi.fn(),
  getIdTokenResult: vi.fn(),
  reload: vi.fn(),
  toJSON: vi.fn(),
  displayName: "Test User",
  email: "test@example.com",
  phoneNumber: "1234567890",
  photoURL: "http://example.com/photo.jpg",
  providerId: "firebase",
};

describe("History Component", () => {
  beforeEach(() => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(null);
      }
      return () => {};
    });
  });

  it("should render the login message when no user is authenticated", () => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(null);
      }
      return () => {};
    });
    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>,
    );

    expect(screen.getByText("you_must_login_or_register")).toBeInTheDocument();
  });

  it("should render the request history when a user is authenticated and history exists", async () => {
    const mockHistory = [
      { method: "GET", url: "https://example.com" },
      { method: "POST", url: "https://example.com/api" },
    ];
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(mockUser);
      }
      return () => {};
    });

    (getHistoryFromLocalStorage as Mock).mockReturnValue(mockHistory);

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>,
    );

    expect(await screen.findByText("History")).toBeInTheDocument();
    expect(screen.getByText("GET")).toBeInTheDocument();
    expect(screen.getByText("POST")).toBeInTheDocument();
    expect(screen.getByText("https://example.com")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/api")).toBeInTheDocument();
  });

  it("should render the empty state message when no requests exist", async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(mockUser);
      }
      return () => {};
    });
    (getHistoryFromLocalStorage as Mock).mockReturnValue(null);

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>,
    );

    expect(await screen.findByText("history_plaseholder")).toBeInTheDocument();
    expect(screen.getByText("Restful Client")).toBeInTheDocument();
    expect(screen.getByText("Graphiql Client")).toBeInTheDocument();
  });
});
