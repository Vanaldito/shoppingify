import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import App from "../../src/App";

describe("App.tsx test", () => {
  it("Should render the App component", () => {
    render(<App />);
  });
});
