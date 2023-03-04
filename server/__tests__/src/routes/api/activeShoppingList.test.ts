import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import supertest from "supertest";
import env from "../../../../environment";
import { app, server } from "../../../../index";
import { ShoppingList, User } from "../../../../src/models";

const api = supertest(app);

describe("activeShoppingList.route.ts test", () => {
  afterAll(() => {
    server.close();
  });

  it("/api/active-shopping-list ~ Should return a status code 401 and a json error if the user auth token is not a string", async () => {
    const response = await api.get("/api/active-shopping-list").expect(401);

    expect(response.body).toEqual({
      status: 401,
      error: "Auth token is not valid",
    });
  });

  it("/api/active-shopping-list ~ Should return a status code 401 and a json error if the auth token is invalid", async () => {
    const response = await api
      .get("/api/active-shopping-list")
      .set("Cookie", ["auth-token=something"])
      .expect(401);

    expect(response.body).toEqual({
      status: 401,
      error: "Auth token is not valid",
    });
  });

  it("/api/active-shopping-list ~ Should return a status code 404 and a json error if the user does not exist or was deleted", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      return new Promise(resolve => resolve(undefined));
    });

    const response = await api
      .get("/api/active-shopping-list")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .expect(404);

    expect(response.body).toEqual({
      status: 404,
      error: "User does not exist or was deleted",
    });
  });

  it("/api/active-shopping-list ~ Should return a status code 500 and a json error if the database throws an error", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      throw new Error("");
    });

    const response = await api
      .get("/api/active-shopping-list")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .expect(500);

    expect(response.body).toEqual({
      status: 500,
      error: "Internal server error",
    });
  });

  it("/api/active-shopping-list ~ Should return a status code 200 and the active shopping list if the user is authenticated", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      const saltRounds = 10;

      return new Promise(resolve =>
        resolve({
          id: 1,
          email: "test@test.com",
          password: bcrypt.hashSync("Password", saltRounds),
          items: [],
          activeShoppingList: {
            name: "default--282342",
            list: [
              {
                category: "Category 1",
                items: [
                  {
                    name: "Item 1",
                    amount: 1,
                    completed: false,
                  },
                ],
              },
            ],
          },
          shoppingHistory: [],
        })
      );
    });

    const response = await api
      .get("/api/active-shopping-list")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
      data: {
        activeShoppingList: {
          name: "default--282342",
          list: [
            {
              category: "Category 1",
              items: [
                {
                  name: "Item 1",
                  amount: 1,
                  completed: false,
                },
              ],
            },
          ],
        },
      },
    });
  });

  it("/api/active-shopping-list/update ~ Should return a status code 401 if the user auth token is not a string", async () => {
    const response = await api
      .post("/api/active-shopping-list/update")
      .expect(401);

    expect(response.body).toEqual({
      status: 401,
      error: "Auth token is not valid",
    });
  });

  it("/api/active-shopping-list/update ~ Should return a status code 401 if the user auth token is invalid", async () => {
    const response = await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", ["auth-token=Something"])
      .expect(401);

    expect(response.body).toEqual({
      status: 401,
      error: "Auth token is not valid",
    });
  });

  it("/api/active-shopping-list/update ~ Should return a status code 400 if the category is not a valid string", async () => {
    const response = await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: 10, name: "Name", amount: 10, completed: false })
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      error: "Category is not valid",
    });

    await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "", name: "Name", amount: 10, completed: false })
      .expect(400);

    await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "\n\n", name: "Name", amount: 10, completed: false })
      .expect(400);
  });

  it("/api/active-shopping-list/update ~ Should return a status code 400 if the name is not a valid string", async () => {
    const response = await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category", name: {}, amount: 10, completed: false })
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      error: "Name is not valid",
    });

    await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category", name: "", amount: 10, completed: false })
      .expect(400);

    await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: "Category",
        name: "\t\t\n",
        amount: 10,
        completed: false,
      })
      .expect(400);
  });

  it("/api/active-shopping-list/update ~ Should return a status code 400 if the amount is not a valid number", async () => {
    const response = await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: "Category",
        name: "Name",
        amount: "10",
        completed: false,
      })
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      error: "Amount is not valid",
    });

    await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: "Category",
        name: "Name",
        amount: -1,
        completed: false,
      })
      .expect(400);

    await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: "Category",
        name: "Name",
        amount: 0,
        completed: false,
      })
      .expect(400);

    await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: "Category",
        name: "Name",
        amount: 0.5,
        completed: false,
      })
      .expect(400);
  });

  it("/api/active-shopping-list/update ~ Should return a status code 400 if the completed property is not a boolean", async () => {
    const response = await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: "Category",
        name: "Name",
        amount: 2,
        completed: [true],
      })
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      error: "Completed property is not valid",
    });
  });

  it("/api/active-shopping-list/update ~ Should return a status code 404 if the user does not exist or was deleted", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      return new Promise(resolve => resolve(undefined));
    });

    const response = await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: "Category",
        name: "Name",
        amount: 10,
        completed: false,
      })
      .expect(404);

    expect(response.body).toEqual({
      status: 404,
      error: "User does not exist or was deleted",
    });
  });

  it("/api/active-shopping-list/update ~ Should return a status code 500 if the database throws an error when finding the user", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      throw new Error("");
    });

    const response = await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: "Category",
        name: "Name",
        amount: 10,
        completed: false,
      })
      .expect(500);

    expect(response.body).toEqual({
      status: 500,
      error: "Internal server error",
    });
  });

  it("/api/active-shopping-list/update ~ Should return a status code 409 if the item does not exist in the items list", async () => {
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
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: "Category 2",
        name: "Item 1",
        amount: 1,
        completed: false,
      })
      .expect(409);

    expect(response.body).toEqual({
      status: 409,
      error: "Item is not in the items list",
    });

    await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: "Category 1",
        name: "Item 2",
        amount: 1,
        completed: false,
      })
      .expect(409);
  });

  it("/api/active-shopping-list/update ~ Should update the item amount and completed property if it already exists in the shopping list", async () => {
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
          activeShoppingList: {
            name: "default--282342",
            list: [
              {
                category: "Category 1",
                items: [{ name: "Item 1", amount: 1, completed: false }],
              },
            ],
          },
          shoppingHistory: [],
        })
      );
    });

    let savedShoppingList: ShoppingList = { name: "default--2823", list: [] };
    jest
      .spyOn(User, "updateActiveShoppingList")
      .mockImplementation((_id, shoppingList) => {
        savedShoppingList = shoppingList;

        return new Promise(resolve => resolve());
      });

    const response = await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: " caTegory 1",
        name: "\t\tITem 1",
        amount: 3,
        completed: true,
      })
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
    });

    expect(savedShoppingList).toEqual({
      name: "default--282342",
      list: [
        {
          category: "Category 1",
          items: [{ name: "Item 1", amount: 3, completed: true }],
        },
      ],
    });
  });

  it("/api/active-shopping-list/update ~ Should create the item and the category ignoring extra spaces if it does not exist in the shopping list", async () => {
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
              ],
            },
            {
              category: "Category 2",
              items: [
                { name: "Item 1", note: "Note 1", image: "https://image1.com" },
              ],
            },
          ],
          activeShoppingList: {
            name: "default--282342",
            list: [
              {
                category: "Category 1",
                items: [{ name: "Item 1", amount: 1, completed: false }],
              },
            ],
          },
          shoppingHistory: [],
        })
      );
    });

    let savedShoppingList: ShoppingList = { name: "default--2823", list: [] };
    jest
      .spyOn(User, "updateActiveShoppingList")
      .mockImplementation((_id, shoppingList) => {
        savedShoppingList = shoppingList;

        return new Promise(resolve => resolve());
      });

    const response = await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: " caTegory 1",
        name: "\t\tITem 2",
        amount: 3,
        completed: true,
      })
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
    });

    expect(savedShoppingList).toEqual({
      name: "default--282342",
      list: [
        {
          category: "Category 1",
          items: [
            { name: "Item 1", amount: 1, completed: false },
            { name: "ITem 2", amount: 3, completed: true },
          ],
        },
      ],
    });

    await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: "Category 2\n",
        name: "\t\tITem 1",
        amount: 5,
        completed: true,
      })
      .expect(200);

    expect(savedShoppingList).toEqual({
      name: "default--282342",
      list: [
        {
          category: "Category 1",
          items: [{ name: "Item 1", amount: 1, completed: false }],
        },
        {
          category: "Category 2",
          items: [{ name: "ITem 1", amount: 5, completed: true }],
        },
      ],
    });
  });

  it("/api/active-shopping-list/update ~ Should return a status code 500 if the database throws an error when updating the active shopping list", async () => {
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
          activeShoppingList: {
            name: "default--282342",
            list: [
              {
                category: "Category 1",
                items: [{ name: "Item 1", amount: 1, completed: false }],
              },
            ],
          },
          shoppingHistory: [],
        })
      );
    });

    jest.spyOn(User, "updateActiveShoppingList").mockImplementation(() => {
      throw new Error("");
    });

    const response = await api
      .post("/api/active-shopping-list/update")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({
        category: "Category 1",
        name: "Item 1",
        amount: 3,
        completed: true,
      })
      .expect(500);

    expect(response.body).toEqual({
      status: 500,
      error: "Internal server error",
    });
  });

  it("/api/active-shopping-list/delete ~ Should return a status code 401 and a json error if the user auth token is invalid", async () => {
    const response1 = await api
      .post("/api/active-shopping-list/delete")
      .expect(401);

    expect(response1.body).toEqual({
      status: 401,
      error: "Auth token is not valid",
    });

    const response2 = await api
      .post("/api/active-shopping-list/delete")
      .set("Cookie", ["auth-token=something"])
      .expect(401);

    expect(response2.body).toEqual({
      status: 401,
      error: "Auth token is not valid",
    });
  });

  it("/api/active-shopping-list/delete ~ Should return a status code 400 and a json error if the category is not a string", async () => {
    const response1 = await api
      .post("/api/active-shopping-list/delete")
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
      .post("/api/active-shopping-list/delete")
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

  it("/api/active-shopping-list/delete ~ Should return a status code 400 if the category is an empty string or a string of spaces only", async () => {
    const response1 = await api
      .post("/api/active-shopping-list/delete")
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
      .post("/api/active-shopping-list/delete")
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

  it("/api/active-shopping-list/delete ~ Should return a status code 400 if the name is not a string", async () => {
    const response1 = await api
      .post("/api/active-shopping-list/delete")
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
      .post("/api/active-shopping-list/delete")
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

  it("/api/active-shopping-list/delete ~ Should return a status code 400 if the name is an empty string or a string of spaces only", async () => {
    const response1 = await api
      .post("/api/active-shopping-list/delete")
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
      .post("/api/active-shopping-list/delete")
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

  it("/api/active-shopping-list/delete ~ Should return a status code 404 if the user does not exist or was deleted", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      return new Promise(resolve => resolve(undefined));
    });

    const response = await api
      .post("/api/active-shopping-list/delete")
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

  it("/api/active-shopping-list/delete ~ Should return a status code 500 if the database throws an error when finding the user", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      throw new Error("");
    });

    const response = await api
      .post("/api/active-shopping-list/delete")
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

  it("/api/active-shopping-list/delete ~ Should return a status code 404 if the item does not exist in the shopping list (case insensitive and ignoring extra spaces)", async () => {
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
          activeShoppingList: {
            name: "default--282342",
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
          },
          shoppingHistory: [],
        })
      );
    });

    jest
      .spyOn(User, "updateActiveShoppingList")
      .mockImplementation(() => new Promise(resolve => resolve()));

    const response1 = await api
      .post("/api/active-shopping-list/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category 1", name: "Item 2" })
      .expect(404);

    expect(response1.body).toEqual({
      status: 404,
      error: "Item is not in the shopping list",
    });

    const response2 = await api
      .post("/api/active-shopping-list/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "  caTegORy 1", name: "\nITem 1  " })
      .expect(200);

    expect(response2.body).toEqual({
      status: 200,
    });
  });

  it("/api/active-shopping-list/delete ~ Should remove the item", async () => {
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
          activeShoppingList: {
            name: "default--282342",
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
                    amount: 20,
                    completed: true,
                  },
                  {
                    name: "Item 3",
                    amount: 30,
                    completed: false,
                  },
                ],
              },
            ],
          },
          shoppingHistory: [],
        })
      );
    });

    let savedShoppingList: ShoppingList = { name: "default--282342", list: [] };
    jest
      .spyOn(User, "updateActiveShoppingList")
      .mockImplementation((_id, shoppingList) => {
        savedShoppingList = shoppingList;

        return new Promise(resolve => resolve());
      });

    const response = await api
      .post("/api/active-shopping-list/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category 1", name: "Item 3" })
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
    });

    expect(savedShoppingList).toEqual({
      name: "default--282342",
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
              amount: 20,
              completed: true,
            },
          ],
        },
      ],
    });
  });

  it("/api/active-shopping-list/delete ~ Should remove the entire category if there are no more items in it", async () => {
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
          activeShoppingList: {
            name: "default--282342",
            list: [
              {
                category: "Category 1",
                items: [
                  {
                    name: "Item 1",
                    amount: 5,
                    completed: true,
                  },
                ],
              },
              {
                category: "Category 2",
                items: [
                  {
                    name: "Item 2",
                    amount: 10,
                    completed: false,
                  },
                ],
              },
            ],
          },
          shoppingHistory: [],
        })
      );
    });

    let savedShoppingList: ShoppingList = { name: "default--282342", list: [] };
    jest
      .spyOn(User, "updateActiveShoppingList")
      .mockImplementation((_id, shoppingList) => {
        savedShoppingList = shoppingList;

        return new Promise(resolve => resolve());
      });

    const response = await api
      .post("/api/active-shopping-list/delete")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .send({ category: "Category 1", name: "Item 1" })
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
    });

    expect(savedShoppingList).toEqual({
      name: "default--282342",
      list: [
        {
          category: "Category 2",
          items: [{ name: "Item 2", amount: 10, completed: false }],
        },
      ],
    });
  });

  it("/api/active-shopping-list/delete ~ Should return a status code 500 if the database throws an error when updating the shopping list", async () => {
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
          activeShoppingList: {
            name: "default--282342",
            list: [
              {
                category: "Category 1",
                items: [
                  {
                    name: "Item 1",
                    amount: 5,
                    completed: true,
                  },
                ],
              },
              {
                category: "Category 2",
                items: [
                  {
                    name: "Item 2",
                    amount: 10,
                    completed: false,
                  },
                ],
              },
            ],
          },
          shoppingHistory: [],
        })
      );
    });

    jest.spyOn(User, "updateActiveShoppingList").mockImplementation(() => {
      throw new Error("");
    });

    const response = await api
      .post("/api/active-shopping-list/delete")
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
