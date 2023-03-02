import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import supertest from "supertest";
import env from "../../../../environment";
import { app, server } from "../../../../index";
import { ItemsList, User } from "../../../../src/models";

const api = supertest(app);

describe("items.route.ts test", () => {
  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("/api/items ~ Should return a status code 401 and a json error if the user auth token is not a string", async () => {
    const response = await api.get("/api/items").expect(401);

    expect(response.body).toEqual({
      status: 401,
      error: "Auth token is not valid",
    });
  });

  it("/api/items ~ Should return a status code 401 and a json error if the auth token is invalid", async () => {
    const response = await api
      .get("/api/items")
      .set("Cookie", ["auth-token=something"])
      .expect(401);

    expect(response.body).toEqual({
      status: 401,
      error: "Auth token is not valid",
    });
  });

  it("/api/items ~ Should return a status code 404 and a json error if the user does not exist or was deleted", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      return new Promise(resolve => resolve(undefined));
    });

    const response = await api
      .get("/api/items")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .expect(404);

    expect(response.body).toEqual({
      status: 404,
      error: "User does not exist or was deleted",
    });
  });

  it("/api/items ~ Should return a status code 500 and a json error if the database throws an error", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      throw new Error("");
    });

    const response = await api
      .get("/api/items")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .expect(500);

    expect(response.body).toEqual({
      status: 500,
      error: "Internal server error",
    });
  });

  it("/api/items ~ Should return a status code 200 and the items list if the user is authenticated", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      const saltRounds = 10;

      return new Promise(resolve =>
        resolve({
          id: 1,
          email: "test@test.com",
          password: bcrypt.hashSync("Password", saltRounds),
          items: [
            {
              category: "Category 1",
              items: [
                { name: "Item 1", note: "Note 1", image: "https://image1.com" },
              ],
            },
          ],
          activeShoppingList: { name: "default--282342", list: [] },
          shoppingHistory: [],
        })
      );
    });

    const response = await api
      .get("/api/items")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
      data: {
        items: [
          {
            category: "Category 1",
            items: [
              { name: "Item 1", note: "Note 1", image: "https://image1.com" },
            ],
          },
        ],
      },
    });
  });

  it("/api/items/add ~ Should return a status code 401 and a json error if the user auth token is invalid", async () => {
    const response1 = await api.post("/api/items/add").expect(401);

    expect(response1.body).toEqual({
      status: 401,
      error: "Auth token is not valid",
    });

    const response2 = await api
      .post("/api/items/add")
      .set("Cookie", ["auth-token=something"])
      .expect(401);

    expect(response2.body).toEqual({
      status: 401,
      error: "Auth token is not valid",
    });
  });

  it("/api/items/add ~ Should return a status code 400 and a json error if the category is not a string", async () => {
    const response1 = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: undefined, name: "Name" })
      .expect(400);

    expect(response1.body).toEqual({
      status: 400,
      error: "Category is not valid",
    });

    const response2 = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: 10, name: "Name" })
      .expect(400);

    expect(response2.body).toEqual({
      status: 400,
      error: "Category is not valid",
    });
  });

  it("/api/items/add ~ Should return a status code 400 if the category is an empty string or a string of spaces only", async () => {
    const response1 = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "", name: "Name" })
      .expect(400);

    expect(response1.body).toEqual({
      status: 400,
      error: "Category is not valid",
    });

    const response2 = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "  \n ", name: "Name" })
      .expect(400);

    expect(response2.body).toEqual({
      status: 400,
      error: "Category is not valid",
    });
  });

  it("/api/items/add ~ Should return a status code 400 if the name is not a string", async () => {
    const response1 = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category", name: undefined })
      .expect(400);

    expect(response1.body).toEqual({
      status: 400,
      error: "Name is not valid",
    });

    const response2 = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category", name: {} })
      .expect(400);

    expect(response2.body).toEqual({
      status: 400,
      error: "Name is not valid",
    });
  });

  it("/api/items/add ~ Should return a status code 400 if the name is an empty string or a string of spaces only", async () => {
    const response1 = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category", name: "" })
      .expect(400);

    expect(response1.body).toEqual({
      status: 400,
      error: "Name is not valid",
    });

    const response2 = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category", name: " \n \r" })
      .expect(400);

    expect(response2.body).toEqual({
      status: 400,
      error: "Name is not valid",
    });
  });

  it("/api/items/add ~ Should return a status code 404 if the user does not exist or was deleted", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      return new Promise(resolve => resolve(undefined));
    });

    const response = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category", name: "Name" })
      .expect(404);

    expect(response.body).toEqual({
      status: 404,
      error: "User does not exist or was deleted",
    });
  });

  it("/api/items/add ~ Should return a status code 500 if the database throws an error when finding the user", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      throw new Error("");
    });

    const response = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category", name: "Name" })
      .expect(500);

    expect(response.body).toEqual({
      status: 500,
      error: "Internal server error",
    });
  });

  it("/api/items/add ~ Should add the item to the category if it already exists", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      const saltRounds = 10;

      return new Promise(resolve =>
        resolve({
          id: 1,
          email: "test@test.com",
          password: bcrypt.hashSync("Password", saltRounds),
          items: [
            {
              category: "Category 1",
              items: [
                { name: "Item 1", note: "Note 1", image: "https://image1.com" },
              ],
            },
          ],
          activeShoppingList: { name: "default--282342", list: [] },
          shoppingHistory: [],
        })
      );
    });

    let savedItems: ItemsList = [];
    jest.spyOn(User, "updateItems").mockImplementation((_id, items) => {
      savedItems = items;

      return new Promise(resolve => resolve());
    });

    const response = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category 1", name: "Item 2" })
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
    });

    expect(savedItems).toEqual([
      {
        category: "Category 1",
        items: [
          { name: "Item 1", note: "Note 1", image: "https://image1.com" },
          { name: "Item 2", note: undefined, image: undefined },
        ],
      },
    ]);
  });

  it("/api/items/add ~ Should add the item and create the category if it doesn't exists", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      const saltRounds = 10;

      return new Promise(resolve =>
        resolve({
          id: 1,
          email: "test@test.com",
          password: bcrypt.hashSync("Password", saltRounds),
          items: [
            {
              category: "Category 1",
              items: [
                { name: "Item 1", note: "Note 1", image: "https://image1.com" },
              ],
            },
          ],
          activeShoppingList: { name: "default--282342", list: [] },
          shoppingHistory: [],
        })
      );
    });

    let savedItems: ItemsList = [];
    jest.spyOn(User, "updateItems").mockImplementation((_id, items) => {
      savedItems = items;

      return new Promise(resolve => resolve());
    });

    const response = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category 2", name: "Item 1" })
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
    });

    expect(savedItems).toEqual([
      {
        category: "Category 1",
        items: [
          { name: "Item 1", note: "Note 1", image: "https://image1.com" },
        ],
      },
      {
        category: "Category 2",
        items: [{ name: "Item 1", note: undefined, image: undefined }],
      },
    ]);
  });

  it("/api/items/add ~ Should return a status code 409 if both the category and the name already exist", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      const saltRounds = 10;

      return new Promise(resolve =>
        resolve({
          id: 1,
          email: "test@test.com",
          password: bcrypt.hashSync("Password", saltRounds),
          items: [
            {
              category: "Category 1",
              items: [
                { name: "Item 1", note: "Note 1", image: "https://image1.com" },
              ],
            },
          ],
          activeShoppingList: { name: "default--282342", list: [] },
          shoppingHistory: [],
        })
      );
    });

    const response = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category 1", name: "Item 1" })
      .expect(409);

    expect(response.body).toEqual({
      status: 409,
      error: "Item already exists",
    });
  });

  it("/api/items/add ~ Should be case insensitive and ignore the extra spaces when looking to see if the category or the name already exist", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      const saltRounds = 10;

      return new Promise(resolve =>
        resolve({
          id: 1,
          email: "test@test.com",
          password: bcrypt.hashSync("Password", saltRounds),
          items: [
            {
              category: "Category 1",
              items: [
                { name: "Item 1", note: "Note 1", image: "https://image1.com" },
              ],
            },
          ],
          activeShoppingList: { name: "default--282342", list: [] },
          shoppingHistory: [],
        })
      );
    });

    const response = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: " category 1", name: "ITEM 1\n" })
      .expect(409);

    expect(response.body).toEqual({
      status: 409,
      error: "Item already exists",
    });
  });

  it("/api/items/add ~ Should save the category and the name trimming the extra spaces", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      const saltRounds = 10;

      return new Promise(resolve =>
        resolve({
          id: 1,
          email: "test@test.com",
          password: bcrypt.hashSync("Password", saltRounds),
          items: [
            {
              category: "Category 1",
              items: [
                { name: "Item 1", note: "Note 1", image: "https://image1.com" },
              ],
            },
          ],
          activeShoppingList: { name: "default--282342", list: [] },
          shoppingHistory: [],
        })
      );
    });

    let savedItems: ItemsList = [];
    jest.spyOn(User, "updateItems").mockImplementation((_id, items) => {
      savedItems = items;

      return new Promise(resolve => resolve());
    });

    const response1 = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "  \nCaTegory 2 ", name: "  \n\rItem 1" })
      .expect(200);

    expect(response1.body).toEqual({
      status: 200,
    });

    expect(savedItems).toEqual([
      {
        category: "Category 1",
        items: [
          { name: "Item 1", note: "Note 1", image: "https://image1.com" },
        ],
      },
      {
        category: "CaTegory 2",
        items: [{ name: "Item 1", note: undefined, image: undefined }],
      },
    ]);

    const response2 = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "  \nCaTegory 1 ", name: "  \n\rItem 2" })
      .expect(200);

    expect(response2.body).toEqual({
      status: 200,
    });

    expect(savedItems).toEqual([
      {
        category: "Category 1",
        items: [
          { name: "Item 1", note: "Note 1", image: "https://image1.com" },
          { name: "Item 2", note: undefined, image: undefined },
        ],
      },
    ]);
  });

  it("/api/items/add ~ Should set the note and the category to undefined if the they are not string or they are empty strings", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      const saltRounds = 10;

      return new Promise(resolve =>
        resolve({
          id: 1,
          email: "test@test.com",
          password: bcrypt.hashSync("Password", saltRounds),
          items: [
            {
              category: "Category 1",
              items: [
                { name: "Item 1", note: "Note 1", image: "https://image1.com" },
              ],
            },
          ],
          activeShoppingList: { name: "default--282342", list: [] },
          shoppingHistory: [],
        })
      );
    });

    let savedItems: ItemsList = [];
    jest.spyOn(User, "updateItems").mockImplementation((_id, items) => {
      savedItems = items;

      return new Promise(resolve => resolve());
    });

    const response1 = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category 1", name: "Item 2", note: 10 })
      .expect(200);

    expect(response1.body).toEqual({
      status: 200,
    });

    expect(savedItems).toEqual([
      {
        category: "Category 1",
        items: [
          { name: "Item 1", note: "Note 1", image: "https://image1.com" },
          { name: "Item 2", note: undefined, image: undefined },
        ],
      },
    ]);

    const response2 = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category 1", name: "Item 2", note: 20, image: "\n  " })
      .expect(200);

    expect(response2.body).toEqual({
      status: 200,
    });

    expect(savedItems).toEqual([
      {
        category: "Category 1",
        items: [
          { name: "Item 1", note: "Note 1", image: "https://image1.com" },
          { name: "Item 2", note: undefined, image: undefined },
        ],
      },
    ]);
  });

  it("/api/items/add ~ Should save the image and the note ignoring the extra spaces", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      const saltRounds = 10;

      return new Promise(resolve =>
        resolve({
          id: 1,
          email: "test@test.com",
          password: bcrypt.hashSync("Password", saltRounds),
          items: [
            {
              category: "Category 1",
              items: [
                { name: "Item 1", note: "Note 1", image: "https://image1.com" },
              ],
            },
          ],
          activeShoppingList: { name: "default--282342", list: [] },
          shoppingHistory: [],
        })
      );
    });

    let savedItems: ItemsList = [];
    jest.spyOn(User, "updateItems").mockImplementation((_id, items) => {
      savedItems = items;

      return new Promise(resolve => resolve());
    });

    const response1 = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category 2", name: "Item 2", note: " Note 2\n" })
      .expect(200);

    expect(response1.body).toEqual({
      status: 200,
    });

    expect(savedItems).toEqual([
      {
        category: "Category 1",
        items: [
          { name: "Item 1", note: "Note 1", image: "https://image1.com" },
        ],
      },
      {
        category: "Category 2",
        items: [{ name: "Item 2", note: "Note 2", image: undefined }],
      },
    ]);

    const response2 = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: "Category 1",
        name: "Item 2",
        note: "Note 2",
        image: "\n \n https://image2.com",
      })
      .expect(200);

    expect(response2.body).toEqual({
      status: 200,
    });

    expect(savedItems).toEqual([
      {
        category: "Category 1",
        items: [
          { name: "Item 1", note: "Note 1", image: "https://image1.com" },
          { name: "Item 2", note: "Note 2", image: "https://image2.com" },
        ],
      },
    ]);
  });

  it("/api/items/add ~ Should return a status code 500 if the database throws an error when updating the items", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      const saltRounds = 10;

      return new Promise(resolve =>
        resolve({
          id: 1,
          email: "test@test.com",
          password: bcrypt.hashSync("Password", saltRounds),
          items: [
            {
              category: "Category 1",
              items: [
                { name: "Item 1", note: "Note 1", image: "https://image1.com" },
              ],
            },
          ],
          activeShoppingList: { name: "default--282342", list: [] },
          shoppingHistory: [],
        })
      );
    });

    jest.spyOn(User, "updateItems").mockImplementation(() => {
      throw new Error("");
    });

    const response = await api
      .post("/api/items/add")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category 2", name: "Item 2", note: " Note 2\n" })
      .expect(500);

    expect(response.body).toEqual({
      status: 500,
      error: "Internal server error",
    });
  });

  it("/api/items/delete ~ Should return a status code 401 and a json error if the user auth token is invalid", async () => {
    const response1 = await api.post("/api/items/delete").expect(401);

    expect(response1.body).toEqual({
      status: 401,
      error: "Auth token is not valid",
    });

    const response2 = await api
      .post("/api/items/delete")
      .set("Cookie", ["auth-token=something"])
      .expect(401);

    expect(response2.body).toEqual({
      status: 401,
      error: "Auth token is not valid",
    });
  });

  it("/api/items/delete ~ Should return a status code 400 and a json error if the category is not a string", async () => {
    const response1 = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: undefined, name: "Name" })
      .expect(400);

    expect(response1.body).toEqual({
      status: 400,
      error: "Category is not valid",
    });

    const response2 = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: 10, name: "Name" })
      .expect(400);

    expect(response2.body).toEqual({
      status: 400,
      error: "Category is not valid",
    });
  });

  it("/api/items/delete ~ Should return a status code 400 if the category is an empty string or a string of spaces only", async () => {
    const response1 = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "", name: "Name" })
      .expect(400);

    expect(response1.body).toEqual({
      status: 400,
      error: "Category is not valid",
    });

    const response2 = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "  \n ", name: "Name" })
      .expect(400);

    expect(response2.body).toEqual({
      status: 400,
      error: "Category is not valid",
    });
  });

  it("/api/items/delete ~ Should return a status code 400 if the name is not a string", async () => {
    const response1 = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category", name: undefined })
      .expect(400);

    expect(response1.body).toEqual({
      status: 400,
      error: "Name is not valid",
    });

    const response2 = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category", name: {} })
      .expect(400);

    expect(response2.body).toEqual({
      status: 400,
      error: "Name is not valid",
    });
  });

  it("/api/items/delete ~ Should return a status code 400 if the name is an empty string or a string of spaces only", async () => {
    const response1 = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category", name: "" })
      .expect(400);

    expect(response1.body).toEqual({
      status: 400,
      error: "Name is not valid",
    });

    const response2 = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category", name: " \n \r" })
      .expect(400);

    expect(response2.body).toEqual({
      status: 400,
      error: "Name is not valid",
    });
  });

  it("/api/items/delete ~ Should return a status code 404 if the user does not exist or was deleted", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      return new Promise(resolve => resolve(undefined));
    });

    const response = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category", name: "Name" })
      .expect(404);

    expect(response.body).toEqual({
      status: 404,
      error: "User does not exist or was deleted",
    });
  });

  it("/api/items/delete ~ Should return a status code 500 if the database throws an error when finding the user", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      throw new Error("");
    });

    const response = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category", name: "Name" })
      .expect(500);

    expect(response.body).toEqual({
      status: 500,
      error: "Internal server error",
    });
  });

  it("/api/items/delete ~ Should return a status code 404 if the item does not exist in the items list (case insensitive and ignoring extra spaces)", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      const saltRounds = 10;

      return new Promise(resolve =>
        resolve({
          id: 1,
          email: "test@test.com",
          password: bcrypt.hashSync("Password", saltRounds),
          items: [
            {
              category: "Category 1",
              items: [
                { name: "Item 1", note: "Note 1", image: "https://image1.com" },
              ],
            },
          ],
          activeShoppingList: { name: "default--282342", list: [] },
          shoppingHistory: [],
        })
      );
    });

    jest
      .spyOn(User, "updateItems")
      .mockImplementation(() => new Promise(resolve => resolve()));

    const response1 = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category 1", name: "Item 2" })
      .expect(404);

    expect(response1.body).toEqual({
      status: 404,
      error: "Item is not in the items list",
    });

    const response2 = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "  caTegORy 1", name: "\nITem 1  " })
      .expect(200);

    expect(response2.body).toEqual({
      status: 200,
    });
  });

  it("/api/items/delete ~ Should remove the item", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      const saltRounds = 10;

      return new Promise(resolve =>
        resolve({
          id: 1,
          email: "test@test.com",
          password: bcrypt.hashSync("Password", saltRounds),
          items: [
            {
              category: "Category 1",
              items: [
                { name: "Item 1", note: "Note 1", image: "https://image1.com" },
                { name: "Item 2", note: "Note 2", image: "https://image2.com" },
                { name: "Item 3", note: "Note 3", image: "https://image3.com" },
              ],
            },
          ],
          activeShoppingList: { name: "default--282342", list: [] },
          shoppingHistory: [],
        })
      );
    });

    let savedItems: ItemsList = [];
    jest.spyOn(User, "updateItems").mockImplementation((_id, items) => {
      savedItems = items;

      return new Promise(resolve => resolve());
    });

    const response = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category 1", name: "Item 1" })
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
    });

    expect(savedItems).toEqual([
      {
        category: "Category 1",
        items: [
          { name: "Item 2", note: "Note 2", image: "https://image2.com" },
          { name: "Item 3", note: "Note 3", image: "https://image3.com" },
        ],
      },
    ]);
  });

  it("/api/items/delete ~ Should remove the entire category if it is the only item in it", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      const saltRounds = 10;

      return new Promise(resolve =>
        resolve({
          id: 1,
          email: "test@test.com",
          password: bcrypt.hashSync("Password", saltRounds),
          items: [
            {
              category: "Category 1",
              items: [
                { name: "Item 1", note: "Note 1", image: "https://image1.com" },
              ],
            },
            {
              category: "Category 2",
              items: [
                { name: "Item 2", note: "Note 2", image: "https://image2.com" },
              ],
            },
          ],
          activeShoppingList: { name: "default--282342", list: [] },
          shoppingHistory: [],
        })
      );
    });

    let savedItems: ItemsList = [];
    jest.spyOn(User, "updateItems").mockImplementation((_id, items) => {
      savedItems = items;

      return new Promise(resolve => resolve());
    });

    const response = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category 1", name: "Item 1" })
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
    });

    expect(savedItems).toEqual([
      {
        category: "Category 2",
        items: [
          { name: "Item 2", note: "Note 2", image: "https://image2.com" },
        ],
      },
    ]);
  });

  it("/api/items/delete ~ Should return a status code 500 if the database throws an error when updating the items list", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      const saltRounds = 10;

      return new Promise(resolve =>
        resolve({
          id: 1,
          email: "test@test.com",
          password: bcrypt.hashSync("Password", saltRounds),
          items: [
            {
              category: "Category 1",
              items: [
                { name: "Item 1", note: "Note 1", image: "https://image1.com" },
              ],
            },
            {
              category: "Category 2",
              items: [
                { name: "Item 2", note: "Note 2", image: "https://image2.com" },
              ],
            },
          ],
          activeShoppingList: { name: "default--282342", list: [] },
          shoppingHistory: [],
        })
      );
    });

    jest.spyOn(User, "updateItems").mockImplementation(() => {
      throw new Error("");
    });

    const response = await api
      .post("/api/items/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category 1", name: "Item 1" })
      .expect(500);

    expect(response.body).toEqual({
      status: 500,
      error: "Internal server error",
    });
  });
});
