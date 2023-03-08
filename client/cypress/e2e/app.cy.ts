describe("general app test", () => {
  it("should visit the page", () => {
    cy.visit("http://localhost:3000");
  });

  it("Should have a meta description tag", () => {
    cy.visit("http://localhost:3000");
    cy.get("meta[name='description']").should(
      "have.attr",
      "content",
      "Shoppingify is the perfect online platform to help you create and manage your shopping lists effortlessly. With its easy-to-use interface, you can quickly add, edit and categorize items, ensuring that you never forget any essential items on your shopping trips. Sign up for Shoppingify today and simplify your shopping experience!"
    );
  });

  it("Should render the navbar", () => {
    cy.visit("http://localhost:3000");
    cy.get("nav");
  });
});
