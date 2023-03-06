import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import supertest from "supertest";
import env from "../../../../environment";
import { app, server } from "../../../../index";
import { User } from "../../../../src/models";

const api = supertest(app);

describe("shoppingHistory.route.ts test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("/api/shopping-history ~ Should return a status code 401 if the user auth token is not valid", async () => {
    const response = await api.get("/api/shopping-history").expect(401);

    expect(response.body).toEqual({
      status: 401,
      error: "Auth token is not valid",
    });

    await api
      .get("/api/shopping-history")
      .set("Cookie", ["auth-token=Something"])
      .expect(401);
  });

  it("/api/shopping-history ~ Should return a status code 404 if the user does not exist or was deleted", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      return new Promise(resolve => resolve(undefined));
    });

    const response = await api
      .get("/api/shopping-history")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .expect(404);

    expect(response.body).toEqual({
      status: 404,
      error: "User does not exist or was deleted",
    });
  });

  it("/api/shopping-history ~ Should return a status code 500 if the database throws an error when finding the user", async () => {
    jest.spyOn(User, "findById").mockImplementation(() => {
      throw new Error("");
    });

    const response = await api
      .get("/api/shopping-history")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .expect(500);

    expect(response.body).toEqual({
      status: 500,
      error: "Internal server error",
    });
  });

  it("/api/shopping-history ~ Should return a status code 200 and the shopping history", async () => {
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
            name: "default--82342",
            list: [],
          },
          shoppingHistory: [
            {
              name: "Name 1",
              state: "completed",
              date: "Tue Aug 19 1975 23:15:30 GMT-0600 (Central Standard Time)",
              list: [
                {
                  category: "Category 1",
                  items: [
                    {
                      name: "Item 1",
                      amount: 10,
                      completed: true,
                    },
                  ],
                },
              ],
            },
          ],
        })
      );
    });

    const response = await api
      .get("/api/shopping-history")
      .set("Cookie", [
        `auth-token=${jwt.sign({ id: 1 }, env.JWT_SECRET as string)}`,
      ])
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
      data: {
        shoppingHistory: [
          {
            name: "Name 1",
            state: "completed",
            date: "Tue Aug 19 1975 23:15:30 GMT-0600 (Central Standard Time)",
            list: [
              {
                category: "Category 1",
                items: [
                  {
                    name: "Item 1",
                    amount: 10,
                    completed: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  });
});
