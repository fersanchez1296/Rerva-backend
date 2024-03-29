import Documents from "../models/document.model.js";
import Solicitudes from "../models/solicitudes.model.js";
export const getDocuments = async (req, res) => {
  try {
    const result = await Documents.find();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
};

export const getHistorial = async (req, res) => {
  try {
    const resultados = await Solicitudes.find({
      DocumentStatus: "Finalizada",
    }).lean();
    res.send(resultados);
  } catch (error) {
    res.send(error);
  }
};

export const getBusqueda = async (req, res) => {
  console.log(req.body);
  try {
    const nuevaSolicitud = new Solicitudes({
      Autor: req.body.Autor,
      Título: req.body["Título"],
      DOI: req.body.DOI,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
