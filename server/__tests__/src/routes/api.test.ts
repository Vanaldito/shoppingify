import bcrypt from "bcrypt";
import { DatabaseError } from "pg";
import supertest from "supertest";
import { app, server } from "../../../index";
import { User } from "../../../src/models";

const api = supertest(app);

jest.spyOn(User, "findByEmail").mockImplementation(email => {
  const saltRounds = 10;

  return new Promise(resolve =>
    resolve({
      id: 1,
      email: email,
      password: bcrypt.hashSync("Password", saltRounds),
      items: [],
      activeShoppingList: { name: "default--282342", list: [] },
      shoppingHistory: [],
    })
  );
});

jest.spyOn(User, "save").mockImplementation(() => {
  return new Promise(resolve => resolve(true));
});

describe("api.ts test", () => {
  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("/api/users/login ~ Should return a status code 400 and a json error if the email is not a string", async () => {
    const response = await api
      .post("/api/users/login")
      .send({ email: 10, password: "Something" })
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      error: "Email is not valid",
    });
  });

  it("/api/users/login ~ Should return a status code 400 and a json error if the email is an empty string or a string of only spaces", async () => {
    const response = await api
      .post("/api/users/login")
      .send({ email: "  \n", password: "Something" })
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      error: "Email is not valid",
    });
  });

  it("/api/users/login ~ Should return a status code 400 and a json error is the email doesn't have the correct format", async () => {
    const response1 = await api
      .post("/api/users/login")
      .send({ email: "hi", password: "Something" })
      .expect(400);

    expect(response1.body).toEqual({
      status: 400,
      error: "Email is not valid",
    });

    const response2 = await api
      .post("/api/users/login")
      .send({ email: "test@test", password: "Something" })
      .expect(400);

    expect(response2.body).toEqual({
      status: 400,
      error: "Email is not valid",
    });
  });

  it("/api/users/login ~ Should return a status code 400 and a json error if the password is not a string", async () => {
    const response = await api
      .post("/api/users/login")
      .send({ email: "test@test.com", password: { a: 1 } })
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      error: "Password is not valid",
    });
  });

  it("/api/users/login ~ Should return a status code 400 and a json error if the password is an empty string or a string of only spaces", async () => {
    const response = await api
      .post("/api/users/login")
      .send({ email: "test@test.com", password: "" })
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      error: "Password is not valid",
    });
  });

  it("/api/users/login ~ Should return a status code 401 and a json error if the email doesn't exist or the password is not correct", async () => {
    const findByEmail = jest
      .spyOn(User, "findByEmail")
      .mockImplementation(email => {
        const saltRounds = 10;

        return new Promise(resolve =>
          resolve({
            id: 1,
            email: email,
            password: bcrypt.hashSync("Password", saltRounds),
            items: [],
            activeShoppingList: { name: "default--282342", list: [] },
            shoppingHistory: [],
          })
        );
      });

    const response = await api
      .post("/api/users/login")
      .send({ email: "test@test.com", password: "NoPassword" })
      .expect(401);

    expect(response.body).toEqual({
      status: 401,
      error: "Email or password incorrect",
    });

    expect(findByEmail).toHaveBeenCalledTimes(1);
  });

  it("/api/users/login ~ Should be case insensitive and ignore the extra spaces of the email property and compare with the hashed password", async () => {
    const findByEmail = jest
      .spyOn(User, "findByEmail")
      .mockImplementation(email => {
        const saltRounds = 10;

        const users = [
          {
            id: 1,
            email: "test@test.com",
            password: bcrypt.hashSync("Password", saltRounds),
            items: [],
            activeShoppingList: { name: "default--282342", list: [] },
            shoppingHistory: [],
          },
        ];

        return new Promise(resolve =>
          resolve(users.find(user => user.email === email))
        );
      });

    const response = await api
      .post("/api/users/login")
      .send({ email: " test@tesT.com", password: "Password" })
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
    });

    expect(findByEmail).toHaveBeenCalledTimes(1);
  });

  it("/api/users/login ~ Should return a status code 500 if the database throws an error", async () => {
    const findByEmail = jest
      .spyOn(User, "findByEmail")
      .mockImplementation(() => {
        throw new Error("Database error");
      });

    const response = await api
      .post("/api/users/login")
      .send({ email: "test@test.com", password: "Password" })
      .expect(500);

    expect(response.body).toEqual({
      status: 500,
      error: "Internal server error",
    });

    expect(findByEmail).toHaveBeenCalledTimes(1);
  });

  it("/api/users/register ~ Should return a status code 400 and a json error if the email is not a string", async () => {
    const response = await api
      .post("/api/users/register")
      .send({ email: 10, password: "Something" })
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      error: "Email is not valid",
    });
  });

  it("/api/users/register ~ Should return a status code 400 and a json error if the email is an empty string or a string of only spaces", async () => {
    const response = await api
      .post("/api/users/register")
      .send({ email: "  \n", password: "Something" })
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      error: "Email is not valid",
    });
  });

  it("/api/users/register ~ Should return a status code 400 and a json error is the email doesn't have the correct format", async () => {
    const response1 = await api
      .post("/api/users/register")
      .send({ email: "hi", password: "Something" })
      .expect(400);

    expect(response1.body).toEqual({
      status: 400,
      error: "Email is not valid",
    });

    const response2 = await api
      .post("/api/users/register")
      .send({ email: "test@test", password: "Something" })
      .expect(400);

    expect(response2.body).toEqual({
      status: 400,
      error: "Email is not valid",
    });
  });

  it("/api/users/register ~ Should return a status code 400 and a json error if the password is not a string", async () => {
    const response = await api
      .post("/api/users/register")
      .send({ email: "test@test.com", password: { a: 1 } })
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      error: "Password is not valid",
    });
  });

  it("/api/users/register ~ Should return a status code 400 and a json error if the password is an empty string or a string of only spaces", async () => {
    const response = await api
      .post("/api/users/register")
      .send({ email: "test@test.com", password: "" })
      .expect(400);

    expect(response.body).toEqual({
      status: 400,
      error: "Password is not valid",
    });
  });

  it("/api/users/register ~ Should save the email in lowercase and without spaces at the beginning or at the end", async () => {
    let savedEmail = "   tesT@test.com";
    jest.spyOn(User, "save").mockImplementation(({ email }) => {
      savedEmail = email;

      return new Promise(resolve => resolve(true));
    });

    const response = await api
      .post("/api/users/register")
      .send({
        email: "   tesT@test.com",
        password: "Password",
      })
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
    });

    expect(savedEmail).toBe("test@test.com");
  });

  it("/api/users/register ~ Should hash the password before saving", async () => {
    let savedPassword = "Password";
    jest.spyOn(User, "save").mockImplementation(({ password }) => {
      savedPassword = password;

      return new Promise(resolve => resolve(true));
    });

    const response = await api
      .post("/api/users/register")
      .send({
        email: "test@test.com",
        password: "Password",
      })
      .expect(200);

    expect(response.body).toEqual({
      status: 200,
    });

    expect(bcrypt.compareSync("Password", savedPassword)).toBe(true);
  });

  it("/api/users/register ~ Should save the user info if all of the email and the password are valid", async () => {
    const saveUser = jest.spyOn(User, "save").mockImplementation(() => {
      return new Promise(resolve => resolve(true));
    });

    const response = await api
      .post("/api/users/register")
      .send({
        email: "test@test.com",
        password: "Password",
      })
      .expect(200);

    expect(saveUser).toHaveBeenCalledTimes(1);

    expect(response.body).toEqual({
      status: 200,
    });
  });

  it("/api/users/register ~ Should return a status code 409 if the email is already used", async () => {
    jest.spyOn(User, "save").mockImplementation(() => {
      throw new DatabaseError(
        'duplicate key value violates unique constraint "users_email_key"',
        205,
        "error"
      );
    });

    const response = await api
      .post("/api/users/register")
      .send({
        email: "test@test.com",
        password: "Password",
      })
      .expect(409);

    expect(response.body).toEqual({
      status: 409,
      error: "Email is already used",
    });
  });

  it("/api/users/register ~ Should return a status code 500 if the database throws an error", async () => {
    jest.spyOn(User, "save").mockImplementation(() => {
      throw new Error("");
    });

    const response = await api
      .post("/api/users/register")
      .send({
        email: "test@test.com",
        password: "Password",
      })
      .expect(500);

    expect(response.body).toEqual({
      status: 500,
      error: "Internal server error",
    });
  });
});
