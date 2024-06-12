import Solicitudes from "../models/solicitudes.model.js";
import Document from "../models/document.model.js";
import { solicitud_aprovada } from "../assets/email-responses/Solicitud-Aprovada/solicitud-aprovada.js";
import { solicitud_rechazada } from "../assets/email-responses/Solicitud-Rechazada/solicitud-rechazada.js";
import mongoose from "mongoose";

export const aceptarSolicitud = async (req, res) => {
  const { id } = req.params;
  const { solicitud, document } = req.body;
  const fechaActual = new Date();
  const horaLocal = fechaActual.toISOString();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await Solicitudes.findOneAndUpdate(
      { _id: id },
      {
        ApprovalStatus: solicitud.status,
        DocumentStatus: "FINALIZADA",
        EndedAt: horaLocal,
        Notas: solicitud.notas,
      },
      { session, new: true }
    );

    if (!result) {
      throw new Error("No se encontró la solicitud");
    }

    const nuevoDocumento = new Document({
      Título: document.titulo,
      Año: document.asnio,
      "Tipo de autoría": document.autoria,
      Autores: document.autores,
      "Tipo de documento": document.tipoDocumento,
      Clasificación: document.clasificacion,
      "Nombre de la revista/libro": document.revista,
      "Compilador/ Editor/ Coordinador/ Libro": document.editor,
      "País de la Publicación": document.pais,
      "Libros/Editorial": document.editorial,
      "Tesis/ Institución": document.tesis,
      "Tipo de consulta": document.tipoConsulta,
      "Link de acceso": document.link,
      DOI: document.doi,
      Área: document.area,
      Campo: document.campo,
      Disciplina: document.disciplina,
      "Municipios de estudio": document.municipios,
      "Palabras Clave": document.palabrasClave,
      Disponibilidad: document.disponibilidad,
      "Número de páginas": document.numeroPaginas,
      Idioma: document.idioma,
    });

    await nuevoDocumento.save({ session });

    await session.commitTransaction();
    session.endSession();

    const email_aprovado = await solicitud_aprovada(
      solicitud.email,
      solicitud.status,
      solicitud.notas,
      solicitud.autor,
      solicitud.titulo,
      solicitud.id
    );
    console.log(email_aprovado);

    res.status(200).json({
      message: "Solicitud actualizada correctamente",
      status: 200,
      result: result,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transacción fallida, se hizo rollback:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const rechazarSolicitud = async (req, res) => {
  const { id } = req.params;
  const { solicitud, document } = req.body;
  const fechaActual = new Date();
  const horaLocal = fechaActual.toISOString();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await Solicitudes.findOneAndUpdate(
      { _id: id },
      {
        ApprovalStatus: solicitud.status,
        DocumentStatus: "FINALIZADA",
        EndedAt: horaLocal,
        Notas: solicitud.notas,
      },
      { session, new: true }
    );

    if (!result) {
      throw new Error("No se encontró la solicitud");
    }

    await session.commitTransaction();
    session.endSession();
    const email_rechazado = await solicitud_rechazada(
      solicitud.email,
      solicitud.status,
      solicitud.notas,
      solicitud.autor,
      solicitud.titulo,
      solicitud.id
    );
    console.log(email_rechazado);

    res.status(200).json({
      message: "Solicitud actualizada correctamente",
      status: 200,
      result: result,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transacción fallida, se hizo rollback:", error);
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
