import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LoginPage } from "../../../src/pages";

describe("LoginPage.tsx test", () => {
  afterEach(cleanup);

  it("Should render the LoginPage component", () => {
    render(<LoginPage />);
  });

  it("Should render the shoppingify logo", () => {
    render(<LoginPage />);

    screen.getByAltText("Shoppingify logo");
  });

  it("Should render the word 'Login' as a heading", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading").textContent).toBe("Login");
  });

  it("Should render an input to enter the email and another one to enter the password", () => {
    render(<LoginPage />);

    screen.getByPlaceholderText("Email");
    screen.getByPlaceholderText("Password");
  });

  it("Should render a button to submit", () => {
    render(<LoginPage />);

    screen.getByRole("button");
  });

  it("Should render a link to navigate to /register", () => {
    render(<LoginPage />);

    const register = screen.getByTitle("Register") as HTMLAnchorElement;

    expect(register.getAttribute("href")).toBe("/register");
  });

  it("Should render a footer with the author name and the devchallenges.io page", () => {
    render(<LoginPage />);

    const authorLink = screen.getByTitle("Vanaldito") as HTMLAnchorElement;
    expect(authorLink.getAttribute("href")).toBe(
      "https://github.com/vanaldito"
    );
    expect(authorLink.getAttribute("target")).toBe("_blank");
    expect(authorLink.getAttribute("rel")).toBe("noopener noreferrer");

    const pageLink = screen.getByTitle("DevChallenges") as HTMLAnchorElement;
    expect(pageLink.getAttribute("href")).toBe("https://devchallenges.io");
    expect(pageLink.getAttribute("target")).toBe("_blank");
    expect(pageLink.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
