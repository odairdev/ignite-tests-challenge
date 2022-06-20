import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to authenticate an user", async () => {
    const user = await createUserUseCase.execute({
      name: "test",
      email: "test@email.com",
      password: "test"
    })

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: "test"
    })

    expect(response).toHaveProperty("token")
  })

  it("should not be able to authenticate an user with wrong password", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "test",
        email: "test@email.com",
        password: "test"
      })

      const response = await authenticateUserUseCase.execute({
        email: user.email,
        password: "wrong"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

  })

  it("should not be able to authenticate an user with wrong email", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "test",
        email: "test@email.com",
        password: "test"
      })

      const response = await authenticateUserUseCase.execute({
        email: "vai@test.com",
        password: "test"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

  })
})
