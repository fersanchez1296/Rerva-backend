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
  try {
    const resultados = await Documents.find({
      $or: [
        { Título: { $regex: req.body.busqueda, $options: "i" } },
        { Autores: { $regex: req.body.busqueda, $options: "i" } },
        { DOI: { $regex: req.body.busqueda, $options: "i" } },
      ],
    });
    if (Array.isArray(resultados) && resultados.length > 0) {
      res
        .status(200)
        .json({
          message: "Encontramos resultados en la base de datos",
          status: 200,
          result: resultados,
        });
    } else {
      res.json({
        message: "No hay información para esta búsqueda",
        status: 404,
      });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
