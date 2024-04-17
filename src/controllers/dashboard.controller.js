import Documents from "../models/document.model.js";
import Autores from "../models/autores.model.js";
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
      DocumentStatus: "FINALIZADA",
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

export const dashboard_estadisticas = async (req, res) => {
  try {
    const [
      totalDocumentos,
      totalAutores,
      distinctInstituciones,
      distinctRevistas,
      distinctAreas,
      distinctPaises,
      distinctDisciplinas,
      distinctCampos,
      
    ] = await Promise.all([
      Documents.countDocuments(),
      Autores.countDocuments(),
      Autores.distinct("INST"),
      Documents.distinct("Nombre de la revista/libro"),
      Documents.distinct("Área"),
      Documents.distinct("País de la Publicación"),
      Documents.distinct("Disciplina"),
      Documents.distinct("Campo"),
    ]);
    
    const totalInstituciones = distinctInstituciones.length;
    const totalRevistas = distinctRevistas.length;
    const totalAreas = distinctAreas.length;
    const totalPaises = distinctPaises.length;
    const totalDisciplinas = distinctDisciplinas.length;
    const totalCampos = distinctCampos.length;

    const documentosData = {
      tDocumentos : totalDocumentos,
      tAutores : totalAutores,
      tInstituciones : totalInstituciones,
      tRevistas : totalRevistas,
      tAreas : totalAreas,
      tPaises : totalPaises,
      tDisciplinas : totalDisciplinas,
      tCampos : totalCampos
    }

    const areasFrecuencia = await Documents.aggregate([
      { $group: { _id: "$Área", count: { $sum: 1 } } },
      { $sort: { count: -1 } }, // Ordenar por frecuencia descendente
    ]);

    const areaslabels = areasFrecuencia.map((area) => area._id);
    const areasValues = areasFrecuencia.map((area) => area.count);

    const documentosGraphicsData = {
      labels : areaslabels,
      datasets : {label : "Publicaciones", data: areasValues},
    };

    res.send({documentosData,documentosGraphicsData,distinctPaises});
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
