import express from 'express'
import {
  handleForgotPassword,
  handleResetPassword,
  handleUserRegister,
  resendVerificationEmail,
  verifyEmail
} from '../controllers/auth.controller'
import validateResource from '../middleware/validateResource'
import { createUserSchema } from '../schemas/user.schema'

const router = express.Router()

router.post('/sing-in', validateResource(createUserSchema), handleUserRegister)
router.post('/sing-up', validateResource(createUserSchema), handleUserRegister)
router.post('/refresh-token', validateResource(createUserSchema), handleUserRegister)

router.post('/forgot-password', handleForgotPassword)
router.post('/reset-password', handleResetPassword)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification-email', resendVerificationEmail)

// oauth routes
router.get('/oauth/google', handleUserRegister)
router.get('/oauth/google/callback', handleUserRegister)

router.get('/oauth/facebook', handleUserRegister)
router.get('/oauth/facebook/callback', handleUserRegister)

export default router
