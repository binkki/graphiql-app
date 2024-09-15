import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import InputField from "../../../components/Input/Input";

describe("InputField Component", () => {
  const handleChangeMock = vi.fn();

  const setup = () => {
    render(
      <InputField
        placeholder="Enter text"
        handleChange={handleChangeMock}
        type="text"
        autoComplete="off"
        id="test-input"
      />,
    );
  };

  it("renders correctly with given props", () => {
    render(
      <InputField
        placeholder="Enter text"
        handleChange={() => {}}
        type="text"
        autoComplete="off"
        id="test-input"
      />,
    );

    const inputElement = screen.getByPlaceholderText("Enter text");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("type", "text");
    expect(inputElement).toHaveAttribute("autoComplete", "off");
    expect(inputElement).toHaveAttribute("id", "test-input");
  });

  it("calls handleChange on input change", () => {
    const handleChangeMock = vi.fn();
    render(
      <InputField
        placeholder="Enter text"
        handleChange={handleChangeMock}
        type="text"
        autoComplete="off"
        id="test-input"
      />,
    );

    const inputElement = screen.getByPlaceholderText("Enter text");
    fireEvent.change(inputElement, { target: { value: "new value" } });
    expect(handleChangeMock).toHaveBeenCalledWith("new value");
  });

  it("should render input field with correct placeholder", () => {
    setup();
    const inputElement = screen.getByPlaceholderText("Enter text");
    expect(inputElement).toBeInTheDocument();
  });

  it("should call handleChange when input value changes", () => {
    setup();
    const inputElement = screen.getByPlaceholderText("Enter text");
    fireEvent.change(inputElement, { target: { value: "test" } });
    expect(handleChangeMock).toHaveBeenCalledWith("test");
  });

  it("should update input value when typed into", () => {
    setup();
    const inputElement = screen.getByPlaceholderText("Enter text");
    fireEvent.change(inputElement, { target: { value: "test" } });
    expect(inputElement).toHaveValue("test");
  });

  it("should have correct type attribute", () => {
    setup();
    const inputElement = screen.getByPlaceholderText("Enter text");
    expect(inputElement).toHaveAttribute("type", "text");
  });

  it("should have correct autoComplete attribute", () => {
    setup();
    const inputElement = screen.getByPlaceholderText("Enter text");
    expect(inputElement).toHaveAttribute("autoComplete", "off");
  });

  it("should have correct id attribute", () => {
    setup();
    const inputElement = screen.getByPlaceholderText("Enter text");
    expect(inputElement).toHaveAttribute("id", "test-input");
  });
});
