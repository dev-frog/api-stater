export default {
  server: {
    port: 'PORT',
    host: 'BASE_API_URL'
  },
  db: {
    project_name: 'PROJECT_NAME',
    username: 'MONGODB_USER',
    password: 'MONGODB_PASSWORD'
  },
  smtp: {
    email: 'SMTP_SERVER_EMAIL',
    password: 'SMTP_SERVER_PASSWORD'
  },
  auth: {
    verify_email_url: 'VERIFY_EMAIL_URL',
    accessTokenPublicKey: 'ACCESS_TOKEN_PUBLIC_KEY',
    accessTokenPrivateKey: 'ACCESS_TOKEN_PRIVATE_KEY',
    refreshTokenPublicKey: 'REFRESH_TOKEN_PUBLIC_KEY',
    refreshTokenPrivateKey: 'REFRESH_TOKEN_PRIVATE_KEY',
    accessTokenTtl: 'ACCESS_TOKEN_TTL',
    refreshTokenTtl: 'REFRESH_TOKEN_TTL',
    password_reset_url: 'RESET_PASSWORD_URL'
  },
  company: {
    name: 'COMPANY_NAME',
    support_url: 'SUPPORT_URL',
    discord_url: 'DISCORD_URL'
  }
}
