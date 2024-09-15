import { render, screen, waitFor } from "@testing-library/react";
import { onAuthStateChanged } from "firebase/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RestfulClient from "../../../../components/Client/RestfulClient/RestfulClient";

const mockedUseNavigate = vi.fn();
vi.mock("@remix-run/react", async () => {
  const mod =
    await vi.importActual<typeof import("@remix-run/react")>(
      "@remix-run/react",
    );
  return {
    ...mod,
    useLoaderData: vi.fn(),
    useNavigate: () => mockedUseNavigate,
  };
});

vi.mock("firebase/auth");
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    ready: true,
  }),
}));

describe("restful client", () => {
  beforeEach(() => {
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      if (typeof callback === "function") {
        callback(null);
      }
      return () => {};
    });
  });

  it("restful client should renders", async () => {
    render(<RestfulClient />);
    expect(screen.getByTestId("restful-editedUrl")).toBeInTheDocument();
    expect(screen.getByTestId("restful-endpointUrl")).toBeInTheDocument();
    expect(screen.getByTestId("restful-mathodSelector")).toBeInTheDocument();
    expect(screen.getByTestId("restful-request-body")).toBeInTheDocument();
    expect(screen.getByTestId("restful-response-body")).toBeInTheDocument();
    expect(screen.getByTestId("restful-response-status")).toBeInTheDocument();
  });

  it("restful client should renders with props", async () => {
    const request = {
      body: "",
      endpointUrl: "",
      headers: [],
      method: "GET",
    };

    const response = {
      body: '{"people":"https://swapi.dev/api/people/","planets":"https://swapi.dev/api/planets/","films":"https://swapi.dev/api/films/","species":"https://swapi.dev/api/species/","vehicles":"https://swapi.dev/api/vehicles/","starships":"https://swapi.dev/api/starships/"}',
      status: "200",
    };

    render(
      <RestfulClient restfulRequest={request} restfulResponse={response} />,
    );

    await waitFor(
      () => {
        screen.findAllByTestId("restful-request-body");
      },
      {
        timeout: 50000,
      },
    );

    const requestBody = screen.getByTestId("restful-request-body").textContent;
    const requestMethod = (
      screen.getByTestId("restful-mathodSelector") as HTMLSelectElement
    ).value;
    const requestEndpointUrl = screen.getByTestId(
      "restful-endpointUrl",
    ).textContent;
    const responseStatus = screen.getByTestId(
      "restful-response-status",
    ).textContent;

    expect(requestBody).toBe(request.body);
    expect(requestMethod).toBe(request.method);
    expect(requestEndpointUrl).toBe(request.endpointUrl);
    expect(responseStatus).toBe(`response-status: ${response.status}`);
  });
});
