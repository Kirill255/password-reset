// create account on https://mailtrap.io/ and find SMTP credentials of your Mailtrap Inbox

const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const { promisify } = require("es6-promisify");
const config = require('../config')

/* 
MAIL_HOST
MAIL_PORT
MAIL_USERNAME
MAIL_PASSWORD
*/

let transporter = nodemailer.createTransport({
    host: config.MAIL_HOST,
    port: config.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.MAIL_USERNAME, // generated ethereal user
        pass: config.MAIL_PASSWORD // generated ethereal password
    }
});

let mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: 'bar@example.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world? Hey, I **love** you.', // plain text body
    html: '<b>Hello world?</b> Hey, I <strong>love</strong> you.' // html body
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        return console.log(err);
    }
    console.log(info);
});

// нужно просто запустить этот код и письмо будет отправлено