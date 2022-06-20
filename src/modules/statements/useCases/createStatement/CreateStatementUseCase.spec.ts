import { OperationType } from './../../enums/OperationType';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementError } from './CreateStatementError';

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase

describe("Create a statement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository)
    statementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
  })

  it("should be able to create a deposit statement for an user", async () => {
    const user = await createUserUseCase.execute({
      name: "test name",
      email: "test@email.com",
      password: "test"
    })

    const depositStatement = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Statement test"
    }

    const response = await createStatementUseCase.execute(depositStatement)

    expect(response).toMatchObject(depositStatement)
  })

  it("should be able to create a withdraw statement for an user", async () => {
    const user = await createUserUseCase.execute({
      name: "test name",
      email: "test@email.com",
      password: "test"
    })

    const depositStatement = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Statement test"
    }

    const withdrawStatement = {
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 500,
      description: "Statement test"
    }

    await createStatementUseCase.execute(depositStatement)
    const response = await createStatementUseCase.execute(withdrawStatement)


    expect(response).toMatchObject(withdrawStatement)
  })

  it("should not be able to create a withdraw statement for an user without funds", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "test name",
        email: "test@email.com",
        password: "test"
      })

      const depositStatement = {
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "Statement test"
      }

      const withdrawStatement = {
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 1100,
        description: "Statement test"
      }

      await createStatementUseCase.execute(depositStatement)
      const response = await createStatementUseCase.execute(withdrawStatement)

      console.log(response)
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
