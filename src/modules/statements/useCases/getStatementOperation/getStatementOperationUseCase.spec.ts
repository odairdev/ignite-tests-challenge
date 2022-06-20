import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { OperationType } from "./../../enums/OperationType";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Create a statement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to list a statement from an user", async () => {
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

    const statementResponse = await createStatementUseCase.execute(
      depositStatement
    );

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statementResponse.id as string,
    });

    expect(response).toMatchObject(statementResponse);
  });
});
