import { CreateUserError } from './CreateUserError';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("should be able to create a user", async () => {
    const user = {
      name: "test name",
      email: "test@email.com",
      password: "test"
    }

    const response = await createUserUseCase.execute(user)

    expect(response).toHaveProperty("id")
    expect(response.name).toEqual("test name")
  })

  it("should not be able to create a user with an email already in use", async () => {
    expect(async () => {
      const user = {
        name: "test name",
        email: "test@email.com",
        password: "test"
      }

      await createUserUseCase.execute(user)
      await createUserUseCase.execute(user)
    }).rejects.toBeInstanceOf(CreateUserError)
    })
})
