import { itemIsInItemsList } from "../../../src/helpers";
import { ItemsList } from "../../../src/models";

describe("itemIsInItemsList.ts test", () => {
  it("Should return false if the category does not exist", () => {
    const items: ItemsList = [
      {
        category: "Category 1",
        items: [
          {
            name: "Item 1",
          },
        ],
      },
    ];

    expect(
      itemIsInItemsList(items, { category: "Category 2", name: "Item 1" })
    ).toBe(false);
  });

  it("Should return false if the category exists but the item does not", () => {
    const items: ItemsList = [
      {
        category: "Category 1",
        items: [
          {
            name: "Item 1",
            image: "Image 1",
          },
        ],
      },
    ];

    expect(
      itemIsInItemsList(items, { category: "Category 1", name: "Item 2" })
    ).toBe(false);
  });

  it("Should return true if the item exists", () => {
    const items: ItemsList = [
      {
        category: "Category 1",
        items: [
          {
            name: "Item 1",
            image: "Image 1",
          },
        ],
      },
    ];

    expect(
      itemIsInItemsList(items, {
        category: "\t\tCatEgory 1",
        name: "\tItEm 1\n\n",
      })
    ).toBe(true);
  });
});
