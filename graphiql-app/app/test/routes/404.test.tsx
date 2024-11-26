import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import NotFound from "../../routes/404";

const mockedUseNavigate = vi.fn();
vi.mock("@remix-run/react", async () => {
  const mod =
    await vi.importActual<typeof import("@remix-run/react")>(
      "@remix-run/react",
    );
  return {
    ...mod,
    useNavigate: () => mockedUseNavigate,
    useLoaderData: vi.fn(),
  };
});

vi.mock("../../utils/encode", () => ({
  decodeBase64: vi.fn(),
}));

vi.mock("../../cookie", () => ({
  i18nCookie: {
    parse: vi.fn(),
  },
}));

global.fetch = vi.fn();

describe("404 route", () => {
  it("should render correctly", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("404-error")).toBeInTheDocument();
  });
});
