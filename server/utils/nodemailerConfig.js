import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const nodemailerConfig = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter;
};

export default nodemailerConfig;

// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// const nodemailerConfig = () => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp-mail.outlook.com",
//     port: 587, // Use port 587 for Outlook
//     secure: false, // TLS must be used when connecting to Outlook's SMTP server
//     auth: {
//       user: process.env.SMTP_MAIL,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   return transporter;
// };

// export default nodemailerConfig;
