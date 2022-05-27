import MongoHelper from "../helpers/mongo";
import { AccountMongoRepository } from "./account";

/* const makeAccountMongoRepository = () => {
  class AccountMongoRepository implements AddAccountRepository {
    add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve, reject) =>
        resolve({
          id: "any_id",
          name: "any_name",
          email: "any_email@gmail.com",
          password: "any_password",
        })
      );
    }
  }

  const accountMongoRepository = new AccountMongoRepository();

  return {
    accountMongoRepository,
  };
}; */

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  test("Sould return an account on success", async () => {
    const accountMongoRepository = new AccountMongoRepository();

    const account = await accountMongoRepository.add({
      name: "any_name",
      email: "any_email@gmail.com",
      password: "any_password",
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@gmail.com");
    expect(account.password).toBe("any_password");
  });
});
