describe("general app test", () => {
  it("should visit the page", () => {
    cy.visit("http://localhost:3000");
  });

  it("Should render the navbar", () => {
    cy.visit("http://localhost:3000");
    cy.get("nav");
  });
});
