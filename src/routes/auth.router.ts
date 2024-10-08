import express from 'express'
import {
  handleForgotPassword,
  userLoginController,
  resendVerificationCodeController,
  userRegisterController,
  verifyEmailController,
  logoutController
} from '../controllers/auth.controller'
import validateResource from '../middleware/validateResource'
import { createUserSchema, LoginInputSchema } from '../schemas'

const router = express.Router()

router.post('/sign-in', validateResource(LoginInputSchema), userLoginController)
router.post('/sign-up', validateResource(createUserSchema), userRegisterController)
router.post('/sign-out')

// router.post('/refresh-token', refreshTokenController)

router.post('/forgot-password', handleForgotPassword)
router.post('/verify-email', verifyEmailController)
router.post('/resend-verification-email', resendVerificationCodeController)

// oauth routes
router.get('/oauth/google')
router.get('/oauth/google/callback')

router.get('/oauth/facebook')
router.get('/oauth/facebook/callback')

export default router
