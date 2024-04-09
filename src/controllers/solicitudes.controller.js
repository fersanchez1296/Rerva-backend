import { io } from "../app.js";
import Solicitudes from "../models/solicitudes.model.js";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

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

export const updateSolicitud = async (req, res) => {
  try {
    console.log(req.body);
    const result = await Solicitudes.findByIdAndUpdate(
      { _id: req.params.id },
      {
        ApprovalStatus: req.body.ApprovalStatus,
        DocumentStatus: req.body.DocumentStatus,
        EndedAt: req.body.EndedAt,
        Notas: req.body.Notas,
      }
    );

    console.log(result);
    if (!result) return res.status(404).json({ message: "No encontrado" });
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
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
