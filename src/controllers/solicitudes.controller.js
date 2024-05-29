import Solicitudes from "../models/solicitudes.model.js";
import Document from "../models/document.model.js";
import { solicitud_aprovada } from "../assets/email-responses/Solicitud-Aprovada/solicitud-aprovada.js";
import { solicitud_rechazada } from "../assets/email-responses/Solicitud-Rechazada/solicitud-rechazada.js";
import mongoose from "mongoose";

export const updateSolicitud = async (req, res) => {
  const fechaActual = new Date();
  const horaLocal = fechaActual.toISOString();
  console.log(req.body.solicitud);
  const solicitud_status = req.body.solicitud.Asunto;
  const session = await mongoose.startSession();
  try {
    const result = await Solicitudes.findOneAndUpdate(
      { _id: req.params.id },
      {
        ApprovalStatus: req.body.solicitud.Asunto,
        DocumentStatus: "FINALIZADA",
        EndedAt: horaLocal,
        Notas: req.body.solicitud.Notas,
      },
      { session, new: true }
    );

    const nuevoDocumento = new Document({
      Título: req.body.addDocument["Título"],
      Año: req.body.addDocument["Año"],
      "Tipo de autoría": req.body.addDocument["Tipo de autoría"],
      Autores: req.body.addDocument.Autores,
      "Tipo de documento": req.body.addDocument["Tipo de documento"],
      Clasificación: req.body.addDocument["Clasificación"],
      "Nombre de la revista/libro": req.body.addDocument["Nombre de la revista/libro"],
      "Compilador/Editor/Coordinador/Libro": req.body.addDocument["Compilador/Editor/Coordinador/Libro"],
      "País de la Publicación": req.body.addDocument["País de la Publicación"],
      "Libros/Editorial": req.body.addDocument["Libros/Editorial"],
      "Tesis/Institución": req.body.addDocument["Tesis/Institución"],
      "Tipo de consulta": req.body.addDocument["Tipo de consulta"],
      "Link de acceso": req.body.addDocument["Link de acceso"],
      DOI: req.body.addDocument.DOI,
      Área: req.body.addDocument["Área"],
      Campo: req.body.addDocument.Campo,
      Disciplina: req.body.addDocument.Disciplina,
      "Municipios de estudio": req.body.addDocument["Municipios de estudio"],
      "Palabras Clave": req.body.addDocument["Palabras Clave"],
      Disponibilidad: req.body.addDocument.Disponibilidad,
      "Número de páginas": req.body.addDocument["Número de páginas"],
      Idioma: req.body.addDocument.Idioma,
    });

    await nuevoDocumento.save({ session });
    await session.commitTransaction();
    session.endSession();

    if (solicitud_status === "Solicitud Aprovada") {
      try {
        const email_aprovado = await solicitud_aprovada(
          req.body.solicitud.Destinatario,
          req.body.solicitud.Asunto,
          req.body.solicitud.Notas,
          req.body.solicitud.Autor,
          req.body.solicitud.Titulo,
          req.body.solicitud.Id
        );
        console.log(email_aprovado);
      } catch (error) {}
    } else {
      try {
        const email_rechazado = await solicitud_rechazada(
          req.body.solicitud.Destinatario,
          req.body.solicitud.Asunto,
          req.body.solicitud.Notas,
          req.body.solicitud.Autor,
          req.body.solicitud.Titulo,
          req.body.solicitud.Id
        );
        console.log(email_rechazado);
      } catch (error) {}
    }

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
    await session.abortTransaction();
    session.endSession();
    console.error('Transacción fallida, se hizo rollback:', error);
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

export const deleteSolicitud = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const result = await Solicitudes.deleteOne({ _id: id });
    console.log(result);
    if (result) {
      res.status(200).json({
        message: "Solicitud eliminada correctamente",
        status: 200,
        result: result,
      });
    } else {
      res.json({
        message: "Ocurrió en error al eliminar la solicitud",
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
