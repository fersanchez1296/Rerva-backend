import { transporter } from "../../../config.js";
import fs from "fs";

const htmlContent = fs.readFileSync(
  "src/assets/email-responses/Solicitud-Rechazada/index.html",
  "utf8"
);

export const solicitud_rechazada = async (
  Destinatario,
  Asunto,
  Notas,
  Nombre,
  Titulo,
  Id
) => {
  const htmlContentValues = htmlContent
    .replace(/{nombre}/g, Nombre)
    .replace(/{id}/g, Id)
    .replace(/{Asunto}/g, Asunto)
    .replace(/{titulo}/g, Titulo)
    .replace(/{retroalimentacion}/g, Notas);
  const email = await transporter.sendMail({
    from: '"RECUV-CUValles" <fernando.sanchez3411@alumnos.udg.mx>',
    to: Destinatario,
    subject: Asunto,
    html: htmlContentValues,
    attachments: [
      {
        filename: "image-1.png",
        path: "src/assets/email-responses/Solicitud-Aprovada/images/image-1.png",
        cid: "facebookImage",
      },
      {
        filename: "image-2.png",
        path: "src/assets/email-responses/Solicitud-Aprovada/images/image-2.png",
        cid: "twitterImage",
      },
      {
        filename: "image-4.png",
        path: "src/assets/email-responses/Solicitud-Aprovada/images/image-4.png",
        cid: "instagramImage",
      },
      {
        filename: "image-5.png",
        path: "src/assets/email-responses/Solicitud-Aprovada/images/image-5.png",
        cid: "headerImage",
      },
      {
        filename: "image-6.png",
        path: "src/assets/email-responses/Solicitud-Aprovada/images/image-6.png",
        cid: "rejectedImage",
      },
    ],
  });

  return email.messageId;
};
