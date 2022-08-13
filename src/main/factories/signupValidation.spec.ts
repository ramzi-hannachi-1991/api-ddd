import { IValidation } from '@/presentation/protocols'
import {
  CompareFieldsValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/presentation/validators'
import { makeSignupValidation } from './signupValidation'

jest.mock('@/presentation/validators/validationComposite')

describe('Signup Validation', () => {
  test('call ValidationComposite', () => {
    makeSignupValidation()

    const validations: IValidation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    )

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
