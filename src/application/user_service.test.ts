import { UserService } from "./user_service";
import { FakeUserRepository } from "../infrastructure/repositories/fake_user_repository";
import { User } from "../domain/entities/user";

describe("UserService", () => {
  let userService: UserService;
  let fakeUserRepository: FakeUserRepository;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    userService = new UserService(fakeUserRepository);
  });

  it("should return null when an invalid ID is passed in", async () => {
    const user = await userService.findUserById("999");
    expect(user).toBeNull();
  });

  it("should return a user when an valid ID is passed in", async () => {
    const user = await userService.findUserById("1");
    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("1");
    expect(user?.getName()).toBe("John Doe");
  });

  it("should save a new user using fake repository and searching again", async () => {
    const newUser = new User("3", "Test User");
    await fakeUserRepository.save(newUser);

    const user = await userService.findUserById("3");
    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("3");
    expect(user?.getName()).toBe("Test User");
  });
});
