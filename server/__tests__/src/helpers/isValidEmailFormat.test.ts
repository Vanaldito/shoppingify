import { isValidEmailFormat } from "../../../src/helpers";

describe("isValidEmailFormat.ts test", () => {
  it("Should return false if the email doesn't have an @ symbol", () => {
    expect(isValidEmailFormat("a")).toBe(false);
    expect(isValidEmailFormat("hi.com")).toBe(false);
  });

  it("Should return false if the email doesn't have a domain", () => {
    expect(isValidEmailFormat("a@a")).toBe(false);
    expect(isValidEmailFormat("a@a.")).toBe(false);
  });

  it("Should return false if the email has spaces", () => {
    expect(isValidEmailFormat("test @test.com")).toBe(false);
    expect(isValidEmailFormat("test@tes t.com")).toBe(false);
  });

  it("Should return true if the email has the @ symbol and a domain", () => {
    expect(isValidEmailFormat("test@tes2t.com")).toBe(true);
    expect(isValidEmailFormat("te_-st@tes2t.com")).toBe(true);
    expect(isValidEmailFormat("t.a@a.com")).toBe(true);
  });
});
