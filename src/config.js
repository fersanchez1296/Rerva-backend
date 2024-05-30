import nodemailer from "nodemailer";
import "dotenv/config";
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "fernando.sanchez3411@alumnos.udg.mx",
    pass: process.env.MAILPASS,
  },
});

transporter.verify().then(() => {
  console.log("Listo para enviar correos");
});
