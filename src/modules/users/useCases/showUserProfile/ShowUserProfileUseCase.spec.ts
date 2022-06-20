import { CreateUserUseCase } from './../createUser/CreateUserUseCase';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';

let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository)
  })

  it("should be able to show an user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "test",
      email: "test@email.com",
      password: "tantofaz"
    })

    const result = await showUserProfileUseCase.execute(user.id as string)

    expect(result).toHaveProperty("id")
  })
})
