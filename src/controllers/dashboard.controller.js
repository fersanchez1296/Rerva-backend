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

export const postDocument = async (req, res) => {
  try {
    const nuevoDocumento = new Document({
      Título: req.body.addDocument["Título"],
      Año: req.body.addDocument["Año"],
      "Tipo de autoría": req.body.addDocument["Tipo de autoría"],
      Autores: req.body.addDocument.Autores,
      "Tipo de documento": req.body.addDocument["Tipo de documento"],
      Clasificación: req.body.addDocument["Clasificación"],
      "Nombre de la revista/libro":
        req.body.addDocument["Nombre de la revista/libro"],
      "Compilador/ Editor/ Coordinador/ Libro":
        req.body.addDocument["Compilador/Editor/Coordinador/Libro"],
      "País de la Publicación": req.body.addDocument["País de la Publicación"],
      "Libros/Editorial": req.body.addDocument["Libros/Editorial"],
      "Tesis/ Institución": req.body.addDocument["Tesis/Institución"],
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

    const result = await nuevoDocumento.save();
    if (!result)
      return res
        .status(404)
        .json({ message: "No Pudimos agregar el documento", status: 500 });
    res.status(200).json({
      message: "¡El documento se agregó correctamente!",
      status: 200,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateDocument = async (req, res) => {
  try {
    const result = await Document.findOneAndUpdate(
      { _id: req.params.Id },
      {
        Título: req.body.addDocument["Título"],
        Año: req.body.addDocument["Año"],
        "Tipo de autoría": req.body.addDocument["Tipo de autoría"],
        Autores: req.body.addDocument.Autores,
        "Tipo de documento": req.body.addDocument["Tipo de documento"],
        Clasificación: req.body.addDocument["Clasificación"],
        "Nombre de la revista/libro":
          req.body.addDocument["Nombre de la revista/libro"],
        "Compilador/ Editor/ Coordinador/ Libro":
          req.body.addDocument["Compilador/Editor/Coordinador/Libro"],
        "País de la Publicación":
          req.body.addDocument["País de la Publicación"],
        "Libros/Editorial": req.body.addDocument["Libros/Editorial"],
        "Tesis/ Institución": req.body.addDocument["Tesis/Institución"],
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
      },
      { new: true }
    );

    if (!result)
      return res
        .status(404)
        .json({ message: "No se pudo actualizar el documento", status: 500 });
    res.status(200).json({
      message: "¡El documento se actualizó correctamente!.",
      status: 200,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteDocument = async (req, res) => {
  const { id } = req.params.id;
  try {
    const result = await Documents.deleteOne({ _id: id });
    console.log(result);
    if (result) {
      res.status(200).json({
        message: "Documento eliminado correctamente",
        status: 200,
        result: result,
      });
    } else {
      res.json({
        message: "Ocurrió en error al eliminar el documento",
        status: 404,
      });
    }
  } catch (error) {
    console.log(error);
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
      res.status(200).json({
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
      tDocumentos: totalDocumentos,
      tAutores: totalAutores,
      tInstituciones: totalInstituciones,
      tRevistas: totalRevistas,
      tAreas: totalAreas,
      tPaises: totalPaises,
      tDisciplinas: totalDisciplinas,
      tCampos: totalCampos,
    };

    const areasFrecuencia = await Documents.aggregate([
      { $group: { _id: "$Área", count: { $sum: 1 } } },
      { $sort: { count: -1 } }, // Ordenar por frecuencia descendente
    ]);

    const areaslabels = areasFrecuencia.map((area) => area._id);
    const areasValues = areasFrecuencia.map((area) => area.count);

    const documentosGraphicsData = {
      labels: areaslabels,
      datasets: { label: "Publicaciones", data: areasValues },
    };

    res.send({ documentosData, documentosGraphicsData, distinctPaises });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
