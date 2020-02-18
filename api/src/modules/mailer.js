const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

//Extract infos from mail.json
const{ host, port, user, pass } = require ('../config/mail.json');

//Connect to mailtrap via smtp
const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
});

//Send mail to mailtrap.io
transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resources/mail'),
    extName: '.html',
}));

module.exports = transport;