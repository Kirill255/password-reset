// create account on https://mailtrap.io/ and find SMTP credentials of your Mailtrap Inbox

const config = require('../config')
const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const { promisify } = require("es6-promisify");


let transporter = nodemailer.createTransport({
    host: config.MAIL_HOST,
    port: config.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.MAIL_USERNAME, // generated ethereal user
        pass: config.MAIL_PASSWORD // generated ethereal password
    }
});

const generateHTML = (filename, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
    const inlined = juice(html);
    return inlined;
};


exports.send = async (options) => {

    const html = generateHTML(options.filename, options); // filename — password-reset.pug
    const text = htmlToText.fromString(html);

    let mailOptions = {
        from: '"Fred Foo 👻" <noreply@example.com>',
        to: options.user.email,
        subject: options.subject,
        text,
        html
    };

    const sendMail = promisify(transporter.sendMail.bind(transporter));

    return sendMail(mailOptions);
};