import { deleteItemFromItemsList } from "../../../src/helpers";
import { ItemsList } from "../../../src/models";

describe("deleteItemFromItemsList.ts test", () => {
  it("Should return false if the item is not in the list", () => {
    const items: ItemsList = [
      {
        category: "Category 1",
        items: [
          {
            name: "Item 1",
            note: "Note 1",
            image: "Image 1",
          },
        ],
      },
    ];

    expect(
      deleteItemFromItemsList(items, { category: "Category 2", name: "Item 2" })
    ).toBe(false);

    expect(items).toEqual([
      {
        category: "Category 1",
        items: [
          {
            name: "Item 1",
            note: "Note 1",
            image: "Image 1",
          },
        ],
      },
    ]);
  });

  it("Should return true and keep the category if there are more items in it", () => {
    const items: ItemsList = [
      {
        category: "Category 1",
        items: [
          {
            name: "Item 1",
            note: "Note 1",
            image: "Image 1",
          },
          {
            name: "Item 2",
            note: "Note 2",
            image: "Image 2",
          },
        ],
      },
    ];

    expect(
      deleteItemFromItemsList(items, {
        category: "CategoRy 1",
        name: "ItEm 2\n\t",
      })
    ).toBe(true);

    expect(items).toEqual([
      {
        category: "Category 1",
        items: [
          {
            name: "Item 1",
            note: "Note 1",
            image: "Image 1",
          },
        ],
      },
    ]);
  });

  it("Should return true and remove the category if there are no more items", () => {
    const items: ItemsList = [
      {
        category: "Category 1",
        items: [
          {
            name: "Item 1",
            note: "Note 1",
            image: "Image 1",
          },
        ],
      },
    ];

    expect(
      deleteItemFromItemsList(items, {
        category: "\n\tCategoRy 1",
        name: "ItEm 1\n\t",
      })
    ).toBe(true);

    expect(items).toEqual([]);
  });
});
