import { updateItemInShoppingList } from "../../../src/helpers";

describe("updateItemInShoppingList.ts test", () => {
  it("Should update the amount and the completed properties of the item if it already exists", () => {
    const shoppingList = {
      name: "default--238234",
      list: [
        {
          category: "Category 1",
          items: [
            {
              name: "Name 1",
              amount: 10,
              completed: false,
            },
          ],
        },
      ],
    };

    updateItemInShoppingList(shoppingList, {
      category: "Category 1\n\t",
      name: "NAME 1",
      amount: 20,
      completed: true,
    });

    expect(shoppingList.list).toEqual([
      {
        category: "Category 1",
        items: [{ name: "Name 1", amount: 20, completed: true }],
      },
    ]);
  });

  it("Should add the item in the category if it already exists", () => {
    const shoppingList = {
      name: "default--238234",
      list: [
        {
          category: "Category 1",
          items: [
            {
              name: "Name 1",
              amount: 10,
              completed: false,
            },
          ],
        },
      ],
    };

    updateItemInShoppingList(shoppingList, {
      category: "CategOry 1\n",
      name: "\t\tName 2\n\n",
      amount: 10,
      completed: true,
    });
    expect(shoppingList.list).toEqual([
      {
        category: "Category 1",
        items: [
          {
            name: "Name 1",
            amount: 10,
            completed: false,
          },
          { name: "Name 2", amount: 10, completed: true },
        ],
      },
    ]);
  });

  it("Should create a new category to add the item if it does not exist", () => {
    const shoppingList = {
      name: "default--238234",
      list: [
        {
          category: "Category 1",
          items: [
            {
              name: "Name 1",
              amount: 10,
              completed: false,
            },
          ],
        },
      ],
    };

    updateItemInShoppingList(shoppingList, {
      category: "Category 2",
      name: "Name 2",
      amount: 10,
      completed: false,
    });

    expect(shoppingList.list).toEqual([
      {
        category: "Category 1",
        items: [
          {
            name: "Name 1",
            amount: 10,
            completed: false,
          },
        ],
      },
      {
        category: "Category 2",
        items: [
          {
            name: "Name 2",
            amount: 10,
            completed: false,
          },
        ],
      },
    ]);
  });
});
