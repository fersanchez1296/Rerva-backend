import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "fernando.sanchez3411@alumnos.udg.mx",
    pass: "xoeh yahk hhqw gfpk ",
  },
});

transporter.verify().then(() => {
  console.log("Listo para enviar correos");
});
