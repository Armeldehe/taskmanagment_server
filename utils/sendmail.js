const nodemailer = require("nodemailer");
const mj = require("nodemailer-mailjet-transport");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

// const transport = nodemailer.createTransport(
//   mj({
//     auth: {
//       apiKey: "33f7539bfb4f6a582f667c909f948c22",
//       apiSecret: "67a30021dab44aee596f8f862539cec3",
//     },
//   }),
// );

const transport = nodemailer.createTransport(
  {port: 1025, 
   auth:{
        user: "user",
        pass: "password"
   } 
  }
);

const sendmail = async (email, subject, payload, template) => {
  const source = fs.readFileSync(path.join(__dirname, template), "utf8");
  const compiledTemplate = handlebars.compile(source);
  const mail = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject,
    html: compiledTemplate(payload),
  };
  //   console.log("mail 1", mail)

  try {
    const info = await transport.sendMail(mail);
    console.log(info);
    return info;
  } catch (err) {
    return err;
    // console.error("erreur d'envoi de mail:", err);
  }
};
module.exports = sendmail;
