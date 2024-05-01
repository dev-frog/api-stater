import { object, string, TypeOf } from 'zod'

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    password: string({
      required_error: 'Password is required'
    })
      .min(8, 'Password must be at least 6 characters')
      .max(20, 'Password must be at most 20 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20})/,
        'Password must contain at least one uppercase, one lowercase, one number and one special character'
      ),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required'
    })
      .min(8, 'Password must be at least 6 characters')
      .max(20, 'Password must be at most 20 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20})/,
        'Password must contain at least one uppercase, one lowercase, one number and one special character'
      ),
    email: string({
      required_error: 'Email is required'
    }).email('Not a valid email'),

    phone: string({
      required_error: 'Phone is required'
    }).regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Phone number must be valid')
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation']
  })
})

export type CreateUserInputType = TypeOf<typeof createUserSchema>['body']
