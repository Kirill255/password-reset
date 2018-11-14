require('dotenv').config()

module.exports = {
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USERNAME: process.env.MAIL_USERNAME,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    SECRET: process.env.SECRET,
    KEY: process.env.KEY,
    DB_URL: process.env.DB_URL
}