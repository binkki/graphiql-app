import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Graphiql from "../../routes/GRAPHQL";

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

describe("GRAPHQL", () => {
  beforeEach(() => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(null);
      }
      return () => {};
    });
  });

  it("renders login message for unauthenticated users", () => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(null);
      }
      return () => {};
    });

    render(
      <MemoryRouter>
        <Graphiql />
      </MemoryRouter>,
    );

    expect(screen.getByText("you_must_login_or_register")).toBeInTheDocument();
  });

  it("renders inputs for authenticated users", () => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(mockUser);
      }
      return () => {};
    });

    render(
      <MemoryRouter>
        <Graphiql />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText("EndpointURL")).toBeInTheDocument();
    expect(screen.getByLabelText("sdlEndpointURL")).toBeInTheDocument();
    expect(screen.getByText("show_headers")).toBeInTheDocument();
    expect(screen.getByText("show_variables")).toBeInTheDocument();
    expect(screen.getByText("execute")).toBeInTheDocument();
  });

  it("toggles header visibility", async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(mockUser);
      }
      return () => {};
    });

    render(
      <MemoryRouter>
        <Graphiql />
      </MemoryRouter>,
    );

    const toggleHeadersButton = screen.getByText("show_headers");
    toggleHeadersButton.click();

    await waitFor(() => {
      const addHeaderButton = screen.getByText("add_header");
      addHeaderButton.click();
      expect(screen.getByPlaceholderText("Header Key")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Header Value")).toBeInTheDocument();
    });
  });

  it("toggles variables visibility", async () => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(mockUser);
      }
      return () => {};
    });

    render(
      <MemoryRouter>
        <Graphiql />
      </MemoryRouter>,
    );

    const toggleVariablesButton = screen.getByText("show_variables");
    await waitFor(() => {
      toggleVariablesButton.click();
    });

    await waitFor(() => {
      const toggleButton = screen.getByText("hide_variables");
      expect(toggleButton).toBeInTheDocument();
      expect(screen.getByText("variables")).toBeInTheDocument();
    });
  });

  it("updates endpoint input", () => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(mockUser);
      }
      return () => {};
    });

    render(
      <MemoryRouter>
        <Graphiql />
      </MemoryRouter>,
    );

    const endpointInput: HTMLInputElement =
      screen.getByLabelText("EndpointURL");
    endpointInput.value = "";
    endpointInput.focus();

    endpointInput.value = "https://rickandmortyapi.com/graphql";
    endpointInput.blur();

    expect(endpointInput.value).toBe("https://rickandmortyapi.com/graphql");
  });
});
