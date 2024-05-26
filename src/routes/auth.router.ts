import express from 'express'
import {
  handleForgotPassword,
  handleResetPassword,
  resendVerificationEmail,
  verifyEmail
} from '../controllers/auth.controller'

const router = express.Router()

router.post('/forgot-password', handleForgotPassword)
router.post('/reset-password', handleResetPassword)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification-email', resendVerificationEmail)

export default router
