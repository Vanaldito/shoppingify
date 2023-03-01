import { insertItemInItemsList } from "../../../src/helpers";
import { ItemsList } from "../../../src/models";

describe("insertItemInItemsList.ts test", () => {
  it("Should return false if the item already exists in the list", () => {
    const list: ItemsList = [
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
      insertItemInItemsList(list, {
        category: "CaTegory 1",
        name: "\n\tITEm 1",
      })
    ).toBe(false);

    expect(list).toEqual([
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

  it("Should return true and create a new category if the category does not exist", () => {
    const list: ItemsList = [
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
      insertItemInItemsList(list, {
        category: "Category 2",
        name: "\nItem 2",
        image: "Image 2\t\t",
      })
    ).toBe(true);

    expect(list).toEqual([
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
      {
        category: "Category 2",
        items: [
          {
            name: "Item 2",
            note: undefined,
            image: "Image 2",
          },
        ],
      },
    ]);
  });

  it("Should return true and append the item if the category already exists", () => {
    const list: ItemsList = [
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
      insertItemInItemsList(list, {
        category: "Category 1",
        name: "\nItem 2",
        note: "Note 2\t\t",
      })
    ).toBe(true);

    expect(list).toEqual([
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
            image: undefined,
          },
        ],
      },
    ]);
  });
});
