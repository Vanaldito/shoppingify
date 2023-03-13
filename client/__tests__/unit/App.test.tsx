import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it } from "vitest";
import App from "../../src/App";

describe("App.tsx test", () => {
  it("Should render the App component", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });
});
