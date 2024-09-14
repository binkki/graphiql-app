import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Index from "../../routes/_index";

// Mock the necessary modules
vi.mock("firebase/auth");
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    ready: true,
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

describe("Index", () => {
  beforeEach(() => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(null);
      }
      return () => {};
    });
  });

  it("renders the greeting for unauthenticated users", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>,
    );

    expect(screen.getByText("greeting")).toBeInTheDocument();
    expect(screen.getByText("please_follow_the_links")).toBeInTheDocument();
    expect(screen.getByText("signin")).toBeInTheDocument();
    expect(screen.getByText("signup")).toBeInTheDocument();
  });

  it("renders the greeting for authenticated users", () => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(mockUser);
      }
      return () => {};
    });

    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>,
    );

    expect(screen.getByText("greeting,")).toBeInTheDocument();
    expect(screen.getByText("test@example.com!")).toBeInTheDocument();
    expect(screen.getByText("Restful Client")).toBeInTheDocument();
    expect(screen.getByText("Graphiql Client")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
  });
});
