import express from 'express'
import {
  handleForgotPassword,
  userLoginController,
  resendVerificationCodeController,
  userRegisterController,
  verifyEmailController
} from '../controllers/auth.controller'
import validateResource from '../middleware/validateResource'
import { createUserSchema, LoginInputSchema } from '../schemas'

const router = express.Router()

router.post('/sing-in', validateResource(LoginInputSchema), userLoginController)
router.post('/sing-up', validateResource(createUserSchema), userRegisterController)
router.post('/refresh-token')

router.post('/forgot-password', handleForgotPassword)
router.post('/verify-email', verifyEmailController)
router.post('/resend-verification-email', resendVerificationCodeController)

// oauth routes
router.get('/oauth/google')
router.get('/oauth/google/callback')

router.get('/oauth/facebook')
router.get('/oauth/facebook/callback')

export default router
