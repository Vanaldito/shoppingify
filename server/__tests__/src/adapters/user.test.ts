import { dbUserAdapter } from "../../../src/adapters";

describe("dbUser.adapter.ts test", () => {
  it("Should return the same id, email and password", () => {
    const result = dbUserAdapter({
      id: 1,
      email: "test@test.com",
      password: "Password",
      items: "[]",
      activeshoppinglist: "{}",
      shoppinghistory: "[]",
    });

    expect(result.id).toBe(1);
    expect(result.email).toBe("test@test.com");
    expect(result.password).toBe("Password");
  });

  it("Should convert the properties items and shoppinghistory to the corresponding array", () => {
    const result = dbUserAdapter({
      id: 1,
      email: "test@test.com",
      password: "Password",
      items: "[]",
      activeshoppinglist: "{}",
      shoppinghistory: '["Hi"]',
    });

    expect(result.items).toEqual([]);
    expect(result.shoppingHistory).toEqual(["Hi"]);
  });

  it("Should convert the property activeshoppinglist to the corresponding object", () => {
    const result = dbUserAdapter({
      id: 1,
      email: "test@test.com",
      password: "Password",
      items: "[]",
      activeshoppinglist: '{"name": "something", "list": []}',
      shoppinghistory: '["Hi"]',
    });

    expect(result.activeShoppingList).toEqual({ name: "something", list: [] });
  });

  it("Should throw an error when the properties items, activeshoppinglist or shoppinghistory can't be parse", () => {
    expect(() => {
      dbUserAdapter({
        id: 1,
        email: "test@test.com",
        password: "Password",
        items: "[",
        activeshoppinglist: '{"name": "something", "list": []}',
        shoppinghistory: '["Hi"]',
      });
    }).toThrow();

    expect(() => {
      dbUserAdapter({
        id: 1,
        email: "test@test.com",
        password: "Password",
        items: "[]",
        activeshoppinglist: '{"nam: "something", "list": []}',
        shoppinghistory: '["Hi"]',
      });
    }).toThrow();
  });
});
