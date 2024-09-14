import { render, screen } from "@testing-library/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Header from "../../components/Header";

vi.mock("firebase/auth");
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    ready: true,
    i18n: {
      resolvedLanguage: "en",
    },
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

describe("Header", () => {
  beforeEach(() => {
    vi.mocked(onAuthStateChanged).mockImplementation((_, nextOrObserver) => {
      if (typeof nextOrObserver === "function") {
        nextOrObserver(null);
      }
      return () => {};
    });
  });

  it("renders the header component for unauthenticated users", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText("Graphiql App")).toBeInTheDocument();
    expect(screen.getByText("signin")).toBeInTheDocument();
    expect(screen.getByText("signup")).toBeInTheDocument();
  });

  it("renders the header component for authenticated users", () => {
    vi.mocked(onAuthStateChanged).mockImplementation((_, nextOrObserver) => {
      if (typeof nextOrObserver === "function") {
        nextOrObserver(mockUser);
      }
      return () => {};
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText("Graphiql App")).toBeInTheDocument();
    expect(screen.getByText("Restful Client")).toBeInTheDocument();
    expect(screen.getByText("Graphiql Client")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
  });
});
