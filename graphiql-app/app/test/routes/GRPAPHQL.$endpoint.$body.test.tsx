import { useLoaderData } from "@remix-run/react";
import { render, screen } from "@testing-library/react";
import { describe, Mock, vi, expect, it } from "vitest";
import { i18nCookie } from "../../cookie";
import GraphiQLResponse, { loader } from "../../routes/GRAPHQL.$endpoint.$body";
import { decodeBase64 } from "../../utils/encode";

vi.mock("@remix-run/react", () => ({
  useLoaderData: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock("../../utils/encode", () => ({
  decodeBase64: vi.fn(),
}));

vi.mock("../../cookie", () => ({
  i18nCookie: {
    parse: vi.fn(),
  },
}));

global.fetch = vi.fn();

describe("GraphiQLResponse component", () => {
  it("should display jsonResponse correctly", () => {
    (useLoaderData as Mock).mockReturnValue({
      jsonResponse: { data: "test data" },
      sdlDocs: null,
      err: null,
    });

    render(<GraphiQLResponse />);

    const responseEditor = screen.getByTestId("restful-response-body");
    expect(responseEditor).toBeInTheDocument();
  });
});

describe("loader function", () => {
  const request = new Request("https://test.com/graphql?lng=en");

  it("should return jsonResponse and sdlDocs on success", async () => {
    (decodeBase64 as Mock)
      .mockReturnValueOnce("https://test-endpoint.com")
      .mockReturnValueOnce(
        JSON.stringify({ query: "{ test }", variables: {} }),
      );
    (i18nCookie.parse as Mock).mockResolvedValue("en");

    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: "test data" }),
    });

    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sdl: "test sdl" }),
    });

    const params = { endpoint: "mockEndpoint", body: "mockBody" };
    const context = {};
    const result = await loader({ params, request, context });

    if (result instanceof Response) {
      const parsedResult = await result.json();

      expect(parsedResult).toEqual({
        jsonResponse: { data: "test data" },
        sdlDocs: { sdl: "test sdl" },
        locale: "en",
        responseStatus: "200",
      });
    } else {
      throw new Error("Expected result to be a Response object");
    }
  });

  it("should return error message on failure", async () => {
    (decodeBase64 as Mock)
      .mockReturnValueOnce("https://test-endpoint.com")
      .mockReturnValueOnce(
        JSON.stringify({ query: "{ test }", variables: {} }),
      );
    (i18nCookie.parse as Mock).mockResolvedValue("en");

    (fetch as Mock).mockRejectedValueOnce(new Error("Fetch failed"));

    const params = { endpoint: "mockEndpoint", body: "mockBody" };
    const context = {};
    const result = await loader({ params, request, context });

    if (result instanceof Response) {
      const parsedResult = await result.json();

      expect(parsedResult).toEqual({
        err: { message: "Fetch failed" },
        locale: "en",
      });
    } else {
      throw new Error("Expected result to be a Response object");
    }
  });
});
