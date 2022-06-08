import { IAddAccountRepository } from '../../../application/protocols'
import { IAccountModel, IAddAccountModel } from '../../../domain'
import { AccountModelMongo } from './account.repository.model'

export class AccountMongoRepository implements IAddAccountRepository {
  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    try {
      const account = new AccountModelMongo(accountData)
      return await account.save()
    } catch (error) {
      // TODO handler error
      throw Error()
    }
  }
}
