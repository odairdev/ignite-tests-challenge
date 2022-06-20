import { GetBalanceUseCase } from './GetBalanceUseCase';
import { OperationType } from "./../../enums/OperationType";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase

describe("Create a statement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)

  });

  it("should be able to list an user's balance", async () => {
    const user = await createUserUseCase.execute({
      name: "test name",
      email: "test@email.com",
      password: "test",
    });

    const depositStatement = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Statement test",
    };

    const withdrawStatement = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Statement test",
    };

    await createStatementUseCase.execute(
      depositStatement
    );

    await createStatementUseCase.execute(withdrawStatement)

    const result = await getBalanceUseCase.execute({
      user_id: user.id as string
    })

    expect(result).toHaveProperty("balance")
  });
});
