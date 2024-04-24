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
<<<<<<< HEAD
    .replace(/{titulo}/g, Titulo)
=======
    .replace(/{título}/g, Titulo)
>>>>>>> 292955c2db736781b2e89c637e3d8b16cacf2676
    .replace(/{retroalimentacion}/g, Notas);
  const email = await transporter.sendMail({
    from: '"RECUV-CUValles" <fernando.sanchez3411@alumnos.udg.mx>',
    to: Destinatario,
    subject: Asunto,
    html: htmlContentValues,
    attachments: [
      {
        filename: "image-1.png",
<<<<<<< HEAD
        path: "src/assets/email-responses/Solicitud-Aprovada/images/image-1.png",
=======
        path: "src/assets/email-responses/Solicitud-Rechazada/images/image-1.png",
>>>>>>> 292955c2db736781b2e89c637e3d8b16cacf2676
        cid: "facebookImage",
      },
      {
        filename: "image-2.png",
<<<<<<< HEAD
        path: "src/assets/email-responses/Solicitud-Aprovada/images/image-2.png",
=======
        path: "src/assets/email-responses/Solicitud-Rechazada/images/image-2.png",
>>>>>>> 292955c2db736781b2e89c637e3d8b16cacf2676
        cid: "twitterImage",
      },
      {
        filename: "image-4.png",
<<<<<<< HEAD
        path: "src/assets/email-responses/Solicitud-Aprovada/images/image-4.png",
=======
        path: "src/assets/email-responses/Solicitud-Rechazada/images/image-4.png",
>>>>>>> 292955c2db736781b2e89c637e3d8b16cacf2676
        cid: "instagramImage",
      },
      {
        filename: "image-5.png",
<<<<<<< HEAD
        path: "src/assets/email-responses/Solicitud-Aprovada/images/image-5.png",
        cid: "headerImage",
      },
      {
        filename: "image-6.png",
        path: "src/assets/email-responses/Solicitud-Aprovada/images/image-6.png",
        cid: "rejectedImage",
=======
        path: "src/assets/email-responses/Solicitud-Rechazada/images/image-5.png",
        cid: "approvedImage",
      },
      {
        filename: "image-6.png",
        path: "src/assets/email-responses/Solicitud-Rechazada/images/image-6.png",
        cid: "headerImage",
>>>>>>> 292955c2db736781b2e89c637e3d8b16cacf2676
      },
    ],
  });

  return email.messageId;
};
