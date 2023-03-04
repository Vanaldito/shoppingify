import { deleteItemFromShoppingList } from "../../../src/helpers";
import { ShoppingList } from "../../../src/models";

describe("deleteItemFromShoppingList.ts test", () => {
  it("Should return false and not delete the item if it does not exist", async () => {
    const shoppingList: ShoppingList = {
      name: "default--83423",
      list: [
        {
          category: "Category 1",
          items: [
            {
              name: "Item 1",
              amount: 10,
              completed: false,
            },
          ],
        },
      ],
    };

    expect(
      deleteItemFromShoppingList(shoppingList, {
        category: "Category 1",
        name: "Item 2",
      })
    ).toBe(false);

    expect(shoppingList).toEqual({
      name: "default--83423",
      list: [
        {
          category: "Category 1",
          items: [
            {
              name: "Item 1",
              amount: 10,
              completed: false,
            },
          ],
        },
      ],
    });
  });

  it("Should return true and delete the item with entire category if there are no more items in the category", async () => {
    const shoppingList: ShoppingList = {
      name: "default--83423",
      list: [
        {
          category: "Category 1",
          items: [
            {
              name: "Item 1",
              amount: 10,
              completed: false,
            },
          ],
        },
      ],
    };

    expect(
      deleteItemFromShoppingList(shoppingList, {
        category: "\n\tCategoRy 1",
        name: "IteM 1",
      })
    ).toBe(true);

    expect(shoppingList).toEqual({
      name: "default--83423",
      list: [],
    });
  });

  it("Should return true and delete the item only if there are more items in the category", async () => {
    const shoppingList: ShoppingList = {
      name: "default--83423",
      list: [
        {
          category: "Category 1",
          items: [
            {
              name: "Item 1",
              amount: 10,
              completed: false,
            },
            {
              name: "Item 2",
              amount: 10,
              completed: true,
            },
          ],
        },
      ],
    };

    expect(
      deleteItemFromShoppingList(shoppingList, {
        category: "\n\tCategoRy 1",
        name: "IteM 2",
      })
    ).toBe(true);

    expect(shoppingList).toEqual({
      name: "default--83423",
      list: [
        {
          category: "Category 1",
          items: [
            {
              name: "Item 1",
              amount: 10,
              completed: false,
            },
          ],
        },
      ],
    });
  });
});
