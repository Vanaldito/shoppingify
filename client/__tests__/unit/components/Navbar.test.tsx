import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { Navbar } from "../../../src/components";

describe("Navbar.tsx test", () => {
  afterEach(cleanup);

  it("Should render the Navbar component", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  });

  it("Should render a nav element", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    screen.getByRole("navigation");
  });

  it("Should render a link to go to the homepage, the link should render the logo of the shoppingify and should have a title", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const homePageLink = screen.getAllByRole("link")[0] as HTMLAnchorElement;

    expect(homePageLink.href).toBe("http://localhost:3000/");
    expect(homePageLink.title).toBe("Shoppingify");

    const logo = homePageLink.querySelector("img") as HTMLImageElement;

    expect(logo.src).toBe("http://localhost:3000/logo.svg");
    expect(logo.alt).toBe("Shoppingify logo");
  });

  it("Should render a list with links to /, /history and /statistics, each link should render an icon and have a title", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const linksList = screen.getByRole("list") as HTMLUListElement;

    const links = linksList.querySelectorAll("a");

    expect(links).toHaveLength(3);

    expect(links[0].href).toBe("http://localhost:3000/");
    expect(links[0].querySelector("svg")).not.toBe(null);
    expect(links[0].title).toBe("Items");

    expect(links[1].href).toBe("http://localhost:3000/history");
    expect(links[1].querySelector("svg")).not.toBe(null);
    expect(links[1].title).toBe("History");

    expect(links[2].href).toBe("http://localhost:3000/statistics");
    expect(links[2].querySelector("svg")).not.toBe(null);
    expect(links[2].title).toBe("Statistics");
  });

  it("Should render a button, the button should render an icon and have an accessible name", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const button = screen.getByRole("button") as HTMLButtonElement;

    expect(button.querySelector("svg")).not.toBe(null);
    expect(button.getAttribute("aria-label")).toBe("Toggle shopping list");
  });
});
