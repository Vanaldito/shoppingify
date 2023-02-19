import jwt from "jsonwebtoken";
import { env } from "process";
import { getUserIdFromToken } from "../../../src/helpers";

describe("getUserIdFromToken.ts test", () => {
  it("Should return undefined if the token is not a string", () => {
    expect(getUserIdFromToken({})).toBeUndefined();
    expect(getUserIdFromToken(203)).toBeUndefined();
    expect(getUserIdFromToken([])).toBeUndefined();
  });

  it("Should return undefined if the token is invalid", () => {
    expect(getUserIdFromToken("Something")).toBeUndefined();
    expect(getUserIdFromToken("")).toBeUndefined();
  });

  it("Should return the id if the token is valid", () => {
    expect(
      getUserIdFromToken(jwt.sign({ id: 20 }, env.JWT_SECRET as string))
    ).toBe(20);
  });
});
