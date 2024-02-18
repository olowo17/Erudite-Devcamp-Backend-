
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: "c465dc7c3bb466",
    pass: "848bf6b5658d06"

  }
});

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async(options)=> {
  // send mail with defined transport object
 const message ={
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message)
  console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;

