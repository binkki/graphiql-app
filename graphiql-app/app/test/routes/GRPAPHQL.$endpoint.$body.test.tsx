import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { useLoaderData } from "@remix-run/react";
import GraphiQLResponse from "../../routes/GRAPHQL.$endpoint.$body";

vi.mock("@remix-run/react", () => ({
  useLoaderData: vi.fn(),
}));

describe("GraphiQLResponse component", () => {
  it("should display jsonResponse correctly", () => {
    (useLoaderData as Mock).mockReturnValue({
      jsonResponse: { data: "test data" },
      sdlDocs: null,
      err: null,
    });

    render(<GraphiQLResponse />);

    expect(screen.getByText(/GraphQLResponse/i)).toBeInTheDocument();
    expect(screen.getByText(/"data": "test data"/i)).toBeInTheDocument();
  });

  it("should toggle documentation visibility", () => {
    (useLoaderData as Mock).mockReturnValue({
      jsonResponse: null,
      sdlDocs: { sdl: "test sdl" },
      err: null,
    });

    render(<GraphiQLResponse />);

    expect(screen.queryByText(/Hide Docs/i)).toBeNull();

    fireEvent.click(screen.getByText(/Show Docs/i));

    expect(screen.getByText(/Hide Docs/i)).toBeInTheDocument();
    expect(screen.getByText(/"sdl": "test sdl"/i)).toBeInTheDocument();
  });

  it("should display error message if available", () => {
    (useLoaderData as Mock).mockReturnValue({
      jsonResponse: null,
      sdlDocs: null,
      err: { message: "An error occurred" },
    });

    render(<GraphiQLResponse />);

    expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
  });
});
