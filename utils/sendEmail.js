const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME, // generated ethereal user
      pass: process.env.SMTP_PASSWORD // generated ethereal password
    }
  });

  try {
    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`, // sender address
      to: options.email, // list of receivers
      subject: options.subject, // Subject line
      text: options.text // plain text body
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;
