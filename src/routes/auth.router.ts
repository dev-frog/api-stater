import express from 'express'
import validateResource from '../middleware/validateResource'
import {
  createUserSchema,
  forgotPasswordSchema,
  LoginInputSchema,
  resendVerificationCodeSchema,
  verificationCodeSchema
} from '../schemas'
import {
  createUserController,
  forgetPasswordController,
  loginController,
  refreshTokenController,
  resendVerificationCodeController,
  verifyEmailController
} from '../controllers'

const router = express.Router()

router.post('/sing-up', validateResource(createUserSchema), createUserController)
router.post('/sing-in', validateResource(LoginInputSchema), loginController)
router.post('/refresh-token', refreshTokenController)
router.post('/verify-email', validateResource(verificationCodeSchema), verifyEmailController)
router.post(
  '/resend-verification-code',
  validateResource(resendVerificationCodeSchema),
  resendVerificationCodeController
)
router.post('/forgot-password', validateResource(forgotPasswordSchema), forgetPasswordController)
export default router
