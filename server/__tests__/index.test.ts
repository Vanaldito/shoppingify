import supertest from "supertest";
import { app, server } from "../index";

const api = supertest(app);

describe("index.ts test", () => {
  afterAll(() => {
    server.close();
  });

  it("Should return 404", async () => {
    await api.get("/").expect(404);
  });
});
