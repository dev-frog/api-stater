import nodemailer from 'nodemailer'
import config from 'config'
import moment from 'moment'
import logger from './logger'
import { loadTemplate } from './loadTemplate'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: config.get('smtp.email') as string,
    pass: config.get('smtp.password') as string
  }
})

export const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: config.get('smtp.email') as string,
    to,
    subject,
    html
  }

  try {
    await transporter.sendMail(mailOptions)
    logger.info(`Email sent to ${to}`)
  } catch (error) {
    logger.error(`Error sending email to ${to}`)
  }
}

export const sendVerificationEmail = async (username: string, userEmail: string, token: string) => {
  const verificationLink = config.get('auth.verify_email_url') as string
  const BASE_API_URL = config.get('server.host') as string
  const subject = 'Email Verification'
  const verificationUrl = `${BASE_API_URL}/${verificationLink}/?token=${token}`
  const companyName = config.get('company.name') as string
  const copyRightYear = moment().format('YYYY')
  const supportTeamURL = config.get('company.support_url') as string
  const discordURL = config.get('company.discord_url') as string

  const html = loadTemplate('verify-email', {
    username,
    verificationUrl,
    subject,
    companyName,
    copyRightYear,
    supportTeamURL,
    discordURL
  })

  await sendEmail(userEmail, subject, html)
}

export const sendPasswordResetEmail = async (username: string, userEmail: string, token: string) => {
  const passwordResetLink = config.get('auth.password_reset_url') as string
  const BASE_API_URL = config.get('server.host') as string
  const subject = 'Password Reset'
  const passwordResetUrl = `${BASE_API_URL}/${passwordResetLink}/${token}?email=${userEmail}`
  const companyName = config.get('company.name') as string
  const copyRightYear = moment().format('YYYY')

  const html = loadTemplate('password-reset', {
    username,
    passwordResetUrl,
    subject,
    companyName,
    copyRightYear
  })

  await sendEmail(userEmail, subject, html)
}
