import express from 'express'
import {
  handleForgotPassword,
  handleUserRegister,
  resendVerificationCodeController,
  verifyEmailController
} from '../controllers/auth.controller'
import validateResource from '../middleware/validateResource'
import { createUserSchema } from '../schemas'

const router = express.Router()

router.post('/sing-in', validateResource(createUserSchema), handleUserRegister)
router.post('/sing-up', validateResource(createUserSchema), handleUserRegister)
router.post('/refresh-token', validateResource(createUserSchema), handleUserRegister)

router.post('/forgot-password', handleForgotPassword)
router.post('/verify-email', verifyEmailController)
router.post('/resend-verification-email', resendVerificationCodeController)

// oauth routes
router.get('/oauth/google', handleUserRegister)
router.get('/oauth/google/callback', handleUserRegister)

router.get('/oauth/facebook', handleUserRegister)
router.get('/oauth/facebook/callback', handleUserRegister)

export default router
