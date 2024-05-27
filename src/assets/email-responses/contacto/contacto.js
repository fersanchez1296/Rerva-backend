import { transporter } from "../../../config.js";

const contacto = async (Remitente, Contenido) => {
  const email = await transporter.sendMail({
    from: Remitente,
    to: "<fernando.sanchez3411@alumnos.udg.mx>",
    subject: "Solicitud de contacto",
    html: `<p>Correo electrónico: <b>${Remitente}</b></p>
            <p>${Contenido}</p>`,
  });

  return email.messageId;
};

export default contacto;
