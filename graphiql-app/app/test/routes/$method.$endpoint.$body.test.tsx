import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Restful from "../../routes/$method.$endpoint.$body";
import { useLoaderData } from "@remix-run/react";
import {
  defaultRestfulRequestState,
  defaultRestfulResponseState,
} from "../../utils/constants";

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

describe("restful route", () => {
  it("should render correctly", () => {
    (useLoaderData as Mock).mockReturnValue({
      restRequest: defaultRestfulRequestState,
      restResponse: defaultRestfulResponseState,
    });

    render(
      <MemoryRouter>
        <Restful />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("restful-client")).toBeInTheDocument();
  });
});
