import { badRequest, serverError } from "../helpers/httpHelper";
import { InvalidParamsError, MissingParamsError } from "../errors";
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "../protocols";
import { AddAccount } from "../../domain/usecases/addAccount";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  handle(httprequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];

      for (const field of requiredFields) {
        if (!httprequest.body[field]) {
          return badRequest(new MissingParamsError(field));
        }
      }

      const { name, email, password, passwordConfirmation } = httprequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamsError("passwordConfirmation"));
      }

      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamsError("email"));
      }

      this.addAccount.add({
        name,
        email,
        password,
      });
    } catch (error) {
      return serverError();
    }

    // TODO remove in future devs
    return {
      statusCode: 500,
      body: "TODO",
    };
  }
}
