import supertest from "supertest";
import { app, server } from "../../../index";
import { User } from "../../../src/models";

const api = supertest(app);

jest.spyOn(User, "findByEmail").mockImplementation(email => {
  return new Promise(resolve =>
    resolve({
      id: 1,
      email: email,
      password: "Password",
    })
  );
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
        return new Promise(resolve =>
          resolve({
            id: 1,
            email: email,
            password: "Password",
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

  it("/api/users/login ~ Should be case insensitive and ignore the extra spaces of the email property", async () => {
    const findByEmail = jest
      .spyOn(User, "findByEmail")
      .mockImplementation(email => {
        const users = [
          {
            id: 1,
            email: "test@test.com",
            password: "Password",
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

  it("/api/users/login ~ Should return a status code 500 if the database throw an error", async () => {
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
});
