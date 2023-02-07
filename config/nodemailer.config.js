var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
  secure: false, // secure:true for port 465, secure:false for port 587
  transportMethod: process.env.EMAIL_TRANSPORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = transporter;
