import Documents from "../models/document.model.js";

export const getDocuments = async (req, res) => {
  const search = req.query.search;
  try {
    const getDocument = await Documents.find({
      $or: [
        { Autores: { $regex: search, $options: "i" } },
        { Título: { $regex: search, $options: "i" } },
        { Temática: { $regex: search, $options: "i" } },
        { "País de la Publicación": { $regex: search, $options: "i" } },
        { "Nombre de la revista/libro": { $regex: search, $options: "i" } },
        { "Tipo de documento": { $regex: search, $options: "i" } },
        { "Libros/Editorial": { $regex: search, $options: "i" } },
        {
          "Compilador/ Editor/ Coordinador/ Libro": {
            $regex: search,
            $options: "i",
          },
        },
        { "Municipios de estudio": { $regex: search, $options: "i" } },
      ],
    });
    res.send(getDocument);
  } catch (error) {
    res.send(error);
  }
};

export const postDocument = (req, res) => {
  res.send(">>>Agregando");
};

export const getDocumentsForDecades = async (req, res) => {
  const yearRange = req.query.search;
  const [startYear, endYear] = yearRange.split("-").map(Number);
  const yearArray = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index
  );
  try {
    const documentsForDecades = await Documents.find({
      Año: { $in: yearArray },
    }).exec();
    res.send(documentsForDecades);
  } catch (error) {
    res.send(error);
  }
};

export const mapGetDocumentsForDecades = async (req, res) => {
  const country = req.query.search;
  try {
    const documentsForDecades = await Documents.find({
      ["País de la Publicación"]: country,
    }).exec();
    res.send(documentsForDecades);
  } catch (error) {
    res.send(error);
  }
};

export const mapGetDocumentsForMunicipios = async (req, res) => {
  const municipio = req.query.search;
  try {
    const documentsForMunicipio = await Documents.find({
      "Municipios de estudio": { $regex: new RegExp(municipio, "i") },
    }).exec();

    // Ordenar por el campo "Año" de mayor a menor
    documentsForMunicipio.sort((a, b) => {
      // Manejar el caso de "S/I" moviéndolos al final
      if (a.Año === "S/I" && b.Año !== "S/I") {
        return 1;
      } else if (a.Año !== "S/I" && b.Año === "S/I") {
        return -1;
      } else {
        // Ordenar por "Año" de mayor a menor
        return parseInt(b.Año) - parseInt(a.Año);
      }
    });

    res.send(documentsForMunicipio);
  } catch (error) {
    res.send(error);
  }
};

export const mapGetDocumentsForPais = async (req, res) => {
  const pais = req.query.search;
  try {
    const documentsForPais = await Documents.find({
      "País de la Publicación": { $regex: new RegExp(pais, "i") },
    }).exec();

    // Ordenar por el campo "Año" de mayor a menor
    documentsForPais.sort((a, b) => {
      // Manejar el caso de "S/I" moviéndolos al final
      if (a.Año === "S/I" && b.Año !== "S/I") {
        return 1;
      } else if (a.Año !== "S/I" && b.Año === "S/I") {
        return -1;
      } else {
        // Ordenar por "Año" de mayor a menor
        return parseInt(b.Año) - parseInt(a.Año);
      }
    });

    res.send(documentsForPais);
  } catch (error) {
    res.send(error);
  }
};


export const chartsGetDocumentsForMunicipios = async (req, res) => {
  const municipio = req.query.search;
  try {
    const documentsForMunicipios = await Documents.find({
      "Municipios de estudio": { $regex: new RegExp(municipio, "i") },
    }).exec();

    const areaFrequency = {};
    const campoFrequency = {};
    const clasificacionFrecuency = {};

    documentsForMunicipios.forEach((document) => {
      const area = document["Área"];
      if (area !== undefined) {
        areaFrequency[area] = (areaFrequency[area] || 0) + 1;
      }
    });

    documentsForMunicipios.forEach((document) => {
      const campo = document["País de la Publicación"];
      if (campo !== undefined) {
        campoFrequency[campo] = (campoFrequency[campo] || 0) + 1;
      }
    });

    documentsForMunicipios.forEach((document) => {
      const clasificacion = document["Clasificación"];
      if (clasificacion !== undefined) {
        clasificacionFrecuency[clasificacion] = 
          (clasificacionFrecuency[clasificacion] || 0) + 1;
      }
    });

    // Ordenar las frecuencias de menor a mayor
    const orderedAreaFrequency = Object.entries(areaFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [area, count]) => ({ ...acc, [area]: count }), {});

    const orderedCampoFrequency = Object.entries(campoFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [campo, count]) => ({ ...acc, [campo]: count }), {});

    const orderedClasificacionFrequency = Object.entries(clasificacionFrecuency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce(
        (acc, [clasificacion, count]) => ({ ...acc, [clasificacion]: count }),
        {}
      );

    res.send([
      orderedAreaFrequency,
      orderedCampoFrequency,
      orderedClasificacionFrequency,
    ]);
  } catch (error) {
    // Manejar errores
    res.status(500).send({ error: "Error al procesar la solicitud" });
  }
};

export const chartsGetDocumentsForPais = async (req, res) => {
  const pais = req.query.search;
  try {
    const documentsForPais = await Documents.find({
      "País de la Publicación": { $regex: new RegExp(pais, "i") },
    }).exec();

    const areaFrequency = {};
    const campoFrequency = {};
    const clasificacionFrecuency = {};

    documentsForPais.forEach((document) => {
      const area = document["Área"];
      if (area !== undefined) {
        areaFrequency[area] = (areaFrequency[area] || 0) + 1;
      }
    });

    documentsForPais.forEach((document) => {
      const campo = document["País de la Publicación"];
      if (campo !== undefined) {
        campoFrequency[campo] = (campoFrequency[campo] || 0) + 1;
      }
    });

    documentsForPais.forEach((document) => {
      const clasificacion = document["Clasificación"];
      if (clasificacion !== undefined) {
        clasificacionFrecuency[clasificacion] = 
          (clasificacionFrecuency[clasificacion] || 0) + 1;
      }
    });

    // Ordenar las frecuencias de menor a mayor
    const orderedAreaFrequency = Object.entries(areaFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [area, count]) => ({ ...acc, [area]: count }), {});

    const orderedCampoFrequency = Object.entries(campoFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [campo, count]) => ({ ...acc, [campo]: count }), {});

    const orderedClasificacionFrequency = Object.entries(clasificacionFrecuency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce(
        (acc, [clasificacion, count]) => ({ ...acc, [clasificacion]: count }),
        {}
      );

    res.send([
      orderedAreaFrequency,
      orderedCampoFrequency,
      orderedClasificacionFrequency,
    ]);
  } catch (error) {
    // Manejar errores
    res.status(500).send({ error: "Error al procesar la solicitud" });
  }
};

export const getDocumentsForArea = async (req, res) => {
  const area = req.query.search;
  const encodedSearch = encodeURIComponent(area);
  try {
    const documentsForArea = await Documents.find({
      Área: area,
    }).exec();
    res.send(documentsForArea);
  } catch (error) {
    res.send(error);
  }
};

export const mapGetDocumentsForArea = async (req, res) => {
  const mapElement = req.query.search;
  const [startYear, endYear] = yearRange.split("-").map(Number);
  const yearArray = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index
  );

  try {
    const documentsForDecades = await Documents.find({
      ["Páis de la Publicación"]: mapElement,
      ["Área"]: country, // Agrega la condición para el país
    }).exec();
    res.send(documentsForDecades);
  } catch (error) {
    res.send(error);
  }
};

export const getDocumentsForDiscipline = async (req, res) => {
  const discipline = req.query.search;
  try {
    const documentsForDiscipline = await Documents.find({
      ["Disciplina "]: discipline,
    }).exec();
    res.send(documentsForDiscipline);
  } catch (error) {
    res.send(error);
  }
};

export const getDocumentsForFieldStudy = async (req, res) => {
  const fieldStudy = req.query.search;
  try {
    const documentsForFieldStudy = await Documents.find({
      Campo: fieldStudy,
    }).exec();
    res.send(documentsForFieldStudy);
  } catch (error) {
    res.send(error);
  }
};

export const getDocumentsForDocumentType = async (req, res) => {
  const documentType = req.query.search;
  try {
    const documentsForDocumentType = await Documents.find({
      ["Tipo de documento"]: documentType,
    }).exec();
    res.send(documentsForDocumentType);
  } catch (error) {
    res.send(error);
  }
};

export const getDocumentsForEditorial = async (req, res) => {
  const editorial = req.query.search;
  try {
    const documentsForEditorial = await Documents.find({
      ["Libros/Editorial"]: editorial,
    }).exec();
    res.send(documentsForEditorial);
  } catch (error) {
    res.send(error);
  }
};

export const getDocumentsForPais = async (req, res) => {
  const pais = req.query.search;
  try {
    const documentsForPais = await Documents.find({
      ["País de la Publicación"]: pais,
    }).exec();
    res.send(documentsForPais);
  } catch (error) {
    res.send(error);
  }
};

export const getDocumentsForMunicipio = async (req, res) => {
  const municipio = req.query.search;
  try {
    const documentsForMunicipio = await Documents.find({
      "Municipios de estudio": { $regex: new RegExp(municipio, "i") },
    }).exec();

    // Ordenar por el campo "Año" de mayor a menor
    documentsForMunicipio.sort((a, b) => {
      // Manejar el caso de "S/I" moviéndolos al final
      if (a.Año === "S/I" && b.Año !== "S/I") {
        return 1;
      } else if (a.Año !== "S/I" && b.Año === "S/I") {
        return -1;
      } else {
        // Ordenar por "Año" de mayor a menor
        return parseInt(b.Año) - parseInt(a.Año);
      }
    });

    res.send(documentsForMunicipio);
  } catch (error) {
    res.send(error);
  }
};


export const getDocumentsForAuthor = async (req, res) => {
  const autor = req.query.search;
  try {
    const documentsForAuthor = await Documents.find({
      ["Autores"]: autor,
    }).exec();
    res.send(documentsForAuthor);
  } catch (error) {
    res.send(error);
  }
};
