import Solicitudes from "../models/solicitudes.model.js";
import { solicitud_aprovada } from "../assets/email-responses/Solicitud-Aprovada/solicitud-aprovada.js";

export const updateSolicitud = async (req, res) => {
  const fechaActual = new Date();
  const horaLocal = fechaActual.toISOString();
  try {
    const result = await Solicitudes.findOneAndUpdate(
      { _id: req.params.id },
      {
        ApprovalStatus: req.body.solicitud.Asunto,
        DocumentStatus: "FINALIZADA",
        EndedAt: horaLocal,
        Notas: req.body.solicitud.Notas,
      },
      { new: true } // Esto asegura que la respuesta sea el documento actualizado
    );
    const notas = "Sin Notas";
    const email = solicitud_aprovada(
      req.body.solicitud.Destinatario,
      req.body.solicitud.Asunto,
      req.body.solicitud.Notas,
      req.body.addDocument.Autores,
      req.body.addDocument["Título"],
      req.body.solicitud.Id,
    );

    console.log(email);

    if (result) {
      res.status(200).json({
        message: "Solicitud actualizada correctamente",
        status: 200,
        result: result,
      });
    } else {
      res.json({
        message: "Ocurrió en error al actualizar la solicitud",
        status: 404,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const getSolicitudes = async (req, res) => {
  try {
    const resultados = await Solicitudes.find({
      DocumentStatus: "Activa",
    }).lean();
    res.send(resultados);
  } catch (error) {
    // Si hay un error, responde con un mensaje de error
    res
      .status(500)
      .send({ message: "Error al obtener solicitudes", error: error.message });
  }
};

export const postSolicitud = async (req, res) => {
  console.log(req.body);
  const fechaActual = new Date();
  const horaLocal = fechaActual.toISOString();
  try {
    const nuevaSolicitud = new Solicitudes({
      Autor: req.body.Autor,
      Título: req.body["Título"],
      Email: req.body.Email,
      Link: req.body.Link ? req.body.Link : "",
      DOI: req.body.DOI,
      ApprovalStatus: "PENDIENTE",
      DocumentStatus: "Activa",
      Notas: "",
      CreatedAt: horaLocal,
    });
    const result = await nuevaSolicitud.save();
    if (!result)
      return res
        .status(404)
        .json({ message: "No Pudimos Registrar tu solicitud", status: 500 });
    res.status(200).json({
      message:
        "¡Gracias por contribuir con nosotros! Pronto estaŕemos en contacto contigo.",
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
