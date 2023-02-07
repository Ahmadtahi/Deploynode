const transporter = require("../../config/nodemailer.config");

exports.sendMail = async (mailOptions) => {
  try {
    const { from, to, subject, html } = mailOptions;
    console.log("debug : ", from, to, subject,)
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("debug sendMail : ", error);
  }
};