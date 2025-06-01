import { User } from "./user";

describe("User Entity", () => {
  it("should create an user instance whit id and name", () => {
    const user = new User("1", "João da Silva");
    expect(user.getId()).toBe("1");
    expect(user.getName()).toBe("João da Silva");
  });

  it("should throw error if name is empty", () => {
    expect(() => new User("1", "")).toThrow("O nome é obrigatório");
  });

  it("should throw error if ID is empty", () => {
    expect(() => new User("", "João")).toThrow("O ID é obrigatório");
  });
});
