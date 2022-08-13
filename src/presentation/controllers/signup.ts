import { IAddUser } from '@/domain/user'
import { InvalidParamsError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/http'
import {
  IController,
  IEmailValidation,
  IHttpRequest,
  IValidation,
  IHttpResponse,
} from '@/presentation/protocols'

export class SignUpController implements IController {
  private readonly validation: IValidation
  private readonly emailValidation: IEmailValidation
  private readonly addUser: IAddUser

  constructor(
    validation: IValidation,
    emailValidation: IEmailValidation,
    addUser: IAddUser
  ) {
    this.validation = validation
    this.emailValidation = emailValidation
    this.addUser = addUser
  }

  async handle(httprequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httprequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httprequest.body

      // if (password !== passwordConfirmation) {
      //   return badRequest(new InvalidParamsError('passwordConfirmation'))
      // }

      const isValidEmail = this.emailValidation.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamsError('email'))
      }

      const user = await this.addUser.add({
        name,
        email,
        password,
      })

      return ok(user)
    } catch (error: unknown) {
      return serverError(error)
    }
  }
}
