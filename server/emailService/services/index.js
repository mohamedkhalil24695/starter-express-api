const nodemailer = require('nodemailer');
const { emailService } = require("../../../config/envVariables");

const transporter = nodemailer.createTransport({
  auth: {
    user: emailService.emailServiceSenderEmail,
    pass: emailService.emailServiceSenderPassword
  },
  host: "smtp-mail.outlook.com",
  secure: false, // upgrade later with STARTTLS
  port: 587,
  pool: true // This is the field you need to add
});

const sendingEmail = async (to, subject, text) => {
  const mailOptions = {
    from: emailService.emailServiceSenderEmail,
    to,
    subject,
    html: text,
  };

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Success", info);
  } catch (error) {
    throw new Error("Email is not sent due to error: " + error);
  }
};




module.exports ={
    sendingEmail
}