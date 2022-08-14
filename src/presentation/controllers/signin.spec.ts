import { IAuthentication } from '@/domain/authentication/authentication'
import {
  InvalidParamsError,
  MissingParamsError,
  ServerError,
} from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/http'
import { IEmailValidationAdapter, IHttpRequest } from '@/presentation/protocols'
import { SignInController } from './signin'

interface IMockSignIn {
  signInController: SignInController
  emailValidationAdapter: IEmailValidationAdapter
  authentication: IAuthentication
}

const mockHttpRequest: IHttpRequest = {
  body: {
    email: 'email@gmail.com',
    password: 'password',
  },
}

const mockAuthentication = (): IAuthentication => {
  class AuthenticationMock implements IAuthentication {
    authentication(_email: string, _password: string): Promise<string | null> {
      return Promise.resolve('token')
    }
  }
  return new AuthenticationMock()
}

const mockEmailValidationAdapter = (): IEmailValidationAdapter => {
  class EmailValidationAdapterMock implements IEmailValidationAdapter {
    isValid(): boolean {
      return true
    }
  }
  return new EmailValidationAdapterMock()
}

const mockSignin = (): IMockSignIn => {
  const emailValidationAdapter = mockEmailValidationAdapter()
  const authentication = mockAuthentication()
  const signInController = new SignInController(
    emailValidationAdapter,
    authentication
  )
  return {
    signInController,
    emailValidationAdapter,
    authentication,
  }
}

describe('Sign In Controller', () => {
  test('400 if no email is provided', async () => {
    const { signInController } = mockSignin()
    const httpRequest = {
      body: {
        password: 'password',
      },
    }
    const httpResponse = await signInController.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamsError('email')))
  })

  test('400 if no password is provided', async () => {
    const { signInController } = mockSignin()
    const httpRequest = {
      body: {
        email: 'email',
      },
    }
    const httpResponse = await signInController.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamsError('password')))
  })

  test('400 if an invalid email', async () => {
    const { signInController, emailValidationAdapter } = mockSignin()

    jest.spyOn(emailValidationAdapter, 'isValid').mockReturnValueOnce(false)
    const httpresponse = await signInController.handle(mockHttpRequest)

    expect(httpresponse).toEqual(badRequest(new InvalidParamsError('email')))
  })

  test('call EmailValidation with correct email', async () => {
    const { signInController, emailValidationAdapter } = mockSignin()

    const isValidSpy = jest.spyOn(emailValidationAdapter, 'isValid')
    await signInController.handle(mockHttpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('email@gmail.com')
  })

  test('500 if EmailValidation throws', async () => {
    const { signInController, emailValidationAdapter } = mockSignin()

    jest.spyOn(emailValidationAdapter, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpresponse = await signInController.handle(mockHttpRequest)

    expect(httpresponse).toEqual(serverError(new ServerError()))
  })

  test('call AddUser with correct values', async () => {
    const { signInController, authentication } = mockSignin()

    const authSpy = jest.spyOn(authentication, 'authentication')
    await signInController.handle(mockHttpRequest)

    expect(authSpy).toHaveBeenCalledWith('email@gmail.com', 'password')
  })

  test('401 if invalid credentials', async () => {
    const { signInController, authentication } = mockSignin()

    jest
      .spyOn(authentication, 'authentication')
      .mockResolvedValueOnce(Promise.resolve(null))
    const httpresponse = await signInController.handle(mockHttpRequest)

    expect(httpresponse).toEqual(unauthorized())
  })

  test('500 if Authentication throws', async () => {
    const { signInController, authentication } = mockSignin()

    jest.spyOn(authentication, 'authentication').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpresponse = await signInController.handle(mockHttpRequest)

    expect(httpresponse).toEqual(serverError(new ServerError()))
  })

  test('200 if valid credentials', async () => {
    const { signInController } = mockSignin()
    const httpresponse = await signInController.handle(mockHttpRequest)
    expect(httpresponse).toEqual(ok({ token: 'token' }))
  })
})
