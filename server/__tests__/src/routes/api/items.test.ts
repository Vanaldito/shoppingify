import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import supertest from "supertest";
import env from "../../../../environment";
import { app, server } from "../../../../index";
import { User } from "../../../../src/models";

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
});
