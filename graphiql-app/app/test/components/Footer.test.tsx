import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Footer from "../../components/Footer";

describe("Footer", () => {
  it("renders the footer component", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByAltText("GitHub logo")).toBeInTheDocument();
    expect(screen.getByAltText("RS School logo")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("contains links to GitHub and RS School", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const githubLink = screen.getByAltText("GitHub logo").closest("a");
    const rsSchoolLink = screen.getByAltText("RS School logo").closest("a");

    expect(githubLink).toHaveAttribute(
      "href",
      "//github.com/binkki/graphiql-app",
    );
    expect(rsSchoolLink).toHaveAttribute("href", "//rs.school/courses/reactjs");
  });
});
