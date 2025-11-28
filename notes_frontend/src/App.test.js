import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders search input", () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/search notes/i);
  expect(input).toBeInTheDocument();
});
