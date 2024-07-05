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

export const verificationCodeSchema = object({
  body: object({
    email: string({
      required_error: 'User email is required'
    }).email('Not a valid email'),

    token: string({
      required_error: 'Verification token is required'
    })
  })
})

export const resendVerificationCodeSchema = object({
  body: object({
    email: string({
      required_error: 'User email is required'
    }).email('Not a valid email')
  })
})

export const LoginInputSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required'
    }).email('Not a valid email'),
    password: string({
      required_error: 'Password is required'
    })
      .min(8, 'Password must be at least 6 characters')
      .max(20, 'Password must be at most 20 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20})/,
        'Password must contain at least one uppercase, one lowercase, one number and one special character'
      )
  })
})

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required'
    }).email('Not a valid email')
  })
})

export type CreateUserInputType = TypeOf<typeof createUserSchema>['body']
export type VerificationCodeInputType = TypeOf<typeof verificationCodeSchema>['body']
export type LoginInputType = TypeOf<typeof LoginInputSchema>['body']
export type ForgotPasswordInputType = TypeOf<typeof forgotPasswordSchema>['body']
export type ResendVerificationCodeInputType = TypeOf<typeof resendVerificationCodeSchema>['body']
