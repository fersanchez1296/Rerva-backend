import Documents from "../models/document.model.js";
import Autores from "../models/autores.model.js";
import normalize from "normalize-strings";

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
    const resultados = await Documents.find({
      "Municipios de estudio": { $regex: new RegExp(municipio, "i") },
    }).exec();

    resultados.sort((a, b) => {
      // Manejar el caso de "S/I" moviéndolos al final
      if (a.Año === "S/I" && b.Año !== "S/I") {
        return 1;
      } else if (a.Año !== "S/I" && b.Año === "S/I") {
        return -1;
      } else {
        return parseInt(b.Año) - parseInt(a.Año);
      }
    });
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};
    const clavesResultados = Object.keys(resultados[0]._doc);

    resultados.forEach((ps) => {
      const pais = ps["País de la Publicación"];
      if (pais !== undefined) {
        paisFrequency[pais] = (paisFrequency[pais] || 0) + 1;
      }
    });

    resultados.forEach((insti) => {
      const inst = insti["Campo"];
      if (inst !== undefined) {
        institucionFrequency[inst] = (institucionFrequency[inst] || 0) + 1;
      }
    });

    resultados.forEach((adsc) => {
      const ads = adsc["Tipo de documento"];
      if (ads !== undefined) {
        adsFrequency[ads] = (adsFrequency[ads] || 0) + 1;
      }
    });

    // Ordenar las frecuencias de menor a mayor
    const orderedPaisFrequency = Object.entries(paisFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [pais, count]) => ({ ...acc, [pais]: count }), {});

    const orderedInstitucionFrequency = Object.entries(institucionFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce(
        (acc, [institucion, count]) => ({ ...acc, [institucion]: count }),
        {}
      );

    const orderedAdsFrequency = Object.entries(adsFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [ads, count]) => ({ ...acc, [ads]: count }), {});
    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedInstitucionFrequency,
        orderedAdsFrequency,
      ],
    });
  } catch (error) {
    res.send(error);
  }
};

export const mapGetDocumentsForPais = async (req, res) => {
  const pais = req.query.search;
  try {
    const resultados = await Documents.find({
      "País de la Publicación": { $regex: new RegExp(pais, "i") },
    }).exec();

    // Ordenar por el campo "Año" de mayor a menor
    resultados.sort((a, b) => {
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
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};
    const clavesResultados = Object.keys(resultados[0]._doc);

    resultados.forEach((ps) => {
      const pais = ps["País de la Publicación"];
      if (pais !== undefined) {
        paisFrequency[pais] = (paisFrequency[pais] || 0) + 1;
      }
    });

    resultados.forEach((insti) => {
      const inst = insti["Campo"];
      if (inst !== undefined) {
        institucionFrequency[inst] = (institucionFrequency[inst] || 0) + 1;
      }
    });

    resultados.forEach((adsc) => {
      const ads = adsc["Tipo de documento"];
      if (ads !== undefined) {
        adsFrequency[ads] = (adsFrequency[ads] || 0) + 1;
      }
    });

    // Ordenar las frecuencias de menor a mayor
    const orderedPaisFrequency = Object.entries(paisFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [pais, count]) => ({ ...acc, [pais]: count }), {});

    const orderedInstitucionFrequency = Object.entries(institucionFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce(
        (acc, [institucion, count]) => ({ ...acc, [institucion]: count }),
        {}
      );

    const orderedAdsFrequency = Object.entries(adsFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [ads, count]) => ({ ...acc, [ads]: count }), {});
    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedInstitucionFrequency,
        orderedAdsFrequency,
      ],
    });
  } catch (error) {
    res.send(error);
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
    const resultados = await Documents.find({
      ["País de la Publicación"]: pais,
    }).exec();
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};
    const clavesResultados = Object.keys(resultados[0]._doc);

    resultados.forEach((ps) => {
      const pais = ps["País de la Publicación"];
      if (pais !== undefined) {
        paisFrequency[pais] = (paisFrequency[pais] || 0) + 1;
      }
    });

    resultados.forEach((insti) => {
      const inst = insti["Campo"];
      if (inst !== undefined) {
        institucionFrequency[inst] = (institucionFrequency[inst] || 0) + 1;
      }
    });

    resultados.forEach((adsc) => {
      const ads = adsc["Tipo de documento"];
      if (ads !== undefined) {
        adsFrequency[ads] = (adsFrequency[ads] || 0) + 1;
      }
    });

    // Ordenar las frecuencias de menor a mayor
    const orderedPaisFrequency = Object.entries(paisFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [pais, count]) => ({ ...acc, [pais]: count }), {});

    const orderedInstitucionFrequency = Object.entries(institucionFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce(
        (acc, [institucion, count]) => ({ ...acc, [institucion]: count }),
        {}
      );

    const orderedAdsFrequency = Object.entries(adsFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [ads, count]) => ({ ...acc, [ads]: count }), {});
    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedInstitucionFrequency,
        orderedAdsFrequency,
      ],
    });
  } catch (error) {
    res.send(error);
  }
};

export const getDocumentsForMunicipio = async (req, res) => {
  const municipio = req.query.search;
  try {
    const resultados = await Documents.find({
      "Municipios de estudio": { $regex: new RegExp(municipio, "i") },
    }).exec();

    // Ordenar por el campo "Año" de mayor a menor
    resultados.sort((a, b) => {
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
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};
    const clavesResultados = Object.keys(resultados[0]._doc);

    resultados.forEach((ps) => {
      const pais = ps["País de la Publicación"];
      if (pais !== undefined) {
        paisFrequency[pais] = (paisFrequency[pais] || 0) + 1;
      }
    });

    resultados.forEach((insti) => {
      const inst = insti["Área"];
      if (inst !== undefined) {
        institucionFrequency[inst] = (institucionFrequency[inst] || 0) + 1;
      }
    });

    resultados.forEach((adsc) => {
      const ads = adsc["Tipo de documento"];
      if (ads !== undefined) {
        adsFrequency[ads] = (adsFrequency[ads] || 0) + 1;
      }
    });

    // Ordenar las frecuencias de menor a mayor
    const orderedPaisFrequency = Object.entries(paisFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [pais, count]) => ({ ...acc, [pais]: count }), {});

    const orderedInstitucionFrequency = Object.entries(institucionFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce(
        (acc, [institucion, count]) => ({ ...acc, [institucion]: count }),
        {}
      );

    const orderedAdsFrequency = Object.entries(adsFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [ads, count]) => ({ ...acc, [ads]: count }), {});
    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedInstitucionFrequency,
        orderedAdsFrequency,
      ],
    });
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

// ************************ cambiar de ubicacion **********************

export const busquedaGeneral = async (req, res) => {
  const busquedaArray = req.query.search.split("+");
  console.log(busquedaArray);
  const busquedaRegex = busquedaArray.map(
    (term) => new RegExp("\\b" + term.replace(/\+/g, " ") + "\\b", "i")
  );

  try {
    const resultados = await Documents.find({
      $or: [
        { Título: { $in: busquedaRegex } },
        { "Tipo de autoría": busquedaRegex },
        {
          Autores: {
            $regex: busquedaRegex.join("|").replace(/ /g, "\\s*,\\s*"),
            $options: "i",
          },
        },
        { Autores: { $regex: busquedaArray.join("|"), $options: "i" } },
        { "Tipo de documento": busquedaRegex },
        { Clasificación: busquedaRegex },
        {
          "Nombre de la revista/libro": busquedaRegex,
        },
        {
          "Compilador/ Editor/ Coordinador/ Libro": busquedaRegex,
        },
        { "País de la Publicación": busquedaRegex },
        {
          "Libros/Editorial": busquedaRegex,
        },
        { "Tesis/ Institución": busquedaRegex },
        { "Tipo de consulta": busquedaRegex },
        { Área: busquedaRegex },
        { Campo: busquedaRegex },
        { Disciplina: busquedaRegex },
        { "Municipios de estudio": busquedaRegex },
        {
          "Palabras Clave": {
            $regex: busquedaRegex.join("|").replace(/ /g, "\\s*,\\s*"),
            $options: "i",
          },
        },
        { Disponibilidad: busquedaRegex },
        {
          Idioma: {
            $regex: busquedaRegex.join("|").replace(/ /g, "\\s*,\\s*"),
            $options: "i",
          },
        },
      ],
    });
    const clavesResultados = Object.keys(resultados[0]._doc);
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};

    resultados.forEach((ps) => {
      const pais = ps["País de la Publicación"];
      if (pais !== undefined) {
        paisFrequency[pais] = (paisFrequency[pais] || 0) + 1;
      }
    });

    resultados.forEach((insti) => {
      const inst = insti["Área"];
      if (inst !== undefined) {
        institucionFrequency[inst] = (institucionFrequency[inst] || 0) + 1;
      }
    });

    resultados.forEach((adsc) => {
      const ads = adsc["Tipo de documento"];
      if (ads !== undefined) {
        adsFrequency[ads] = (adsFrequency[ads] || 0) + 1;
      }
    });

    // Ordenar las frecuencias de menor a mayor
    const orderedPaisFrequency = Object.entries(paisFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [pais, count]) => ({ ...acc, [pais]: count }), {});

    const orderedInstitucionFrequency = Object.entries(institucionFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce(
        (acc, [institucion, count]) => ({ ...acc, [institucion]: count }),
        {}
      );

    const orderedAdsFrequency = Object.entries(adsFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [ads, count]) => ({ ...acc, [ads]: count }), {});
    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedInstitucionFrequency,
        orderedAdsFrequency,
      ],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const busquedaAutores = async (req, res) => {
  const busqueda = req.query.search.replace(/\+/g, " ");

  try {
    const resultados = await Autores.find({
      Autor: { $regex: `(${busqueda})`, $options: "i" },
    });
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};
    const clavesResultados = Object.keys(resultados[0]._doc);

    resultados.forEach((ps) => {
      const pais = ps["País"];
      if (pais !== undefined) {
        paisFrequency[pais] = (paisFrequency[pais] || 0) + 1;
      }
    });

    resultados.forEach((insti) => {
      const inst = insti["INST"];
      if (inst !== undefined) {
        institucionFrequency[inst] = (institucionFrequency[inst] || 0) + 1;
      }
    });

    resultados.forEach((adsc) => {
      const ads = adsc["ADS"];
      if (ads !== undefined) {
        adsFrequency[ads] = (adsFrequency[ads] || 0) + 1;
      }
    });

    // Ordenar las frecuencias de menor a mayor
    const orderedPaisFrequency = Object.entries(paisFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [pais, count]) => ({ ...acc, [pais]: count }), {});

    const orderedInstitucionFrequency = Object.entries(institucionFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce(
        (acc, [institucion, count]) => ({ ...acc, [institucion]: count }),
        {}
      );

    const orderedAdsFrequency = Object.entries(adsFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [ads, count]) => ({ ...acc, [ads]: count }), {});
    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedInstitucionFrequency,
        orderedAdsFrequency,
      ],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const busquedaRevista = async (req, res) => {
  const busqueda = req.query.search.replace(/\+/g, " ");

  try {
    const resultados = await Documents.find({
      "Nombre de la revista/libro": { $regex: `(${busqueda})`, $options: "i" },
    });
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};
    const clavesResultados = Object.keys(resultados[0]._doc);

    resultados.forEach((ps) => {
      const pais = ps["País de la Publicación"];
      if (pais !== undefined) {
        paisFrequency[pais] = (paisFrequency[pais] || 0) + 1;
      }
    });

    resultados.forEach((insti) => {
      const inst = insti["Área"];
      if (inst !== undefined) {
        institucionFrequency[inst] = (institucionFrequency[inst] || 0) + 1;
      }
    });

    resultados.forEach((adsc) => {
      const ads = adsc["Tipo de documento"];
      if (ads !== undefined) {
        adsFrequency[ads] = (adsFrequency[ads] || 0) + 1;
      }
    });

    // Ordenar las frecuencias de menor a mayor
    const orderedPaisFrequency = Object.entries(paisFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [pais, count]) => ({ ...acc, [pais]: count }), {});

    const orderedInstitucionFrequency = Object.entries(institucionFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce(
        (acc, [institucion, count]) => ({ ...acc, [institucion]: count }),
        {}
      );

    const orderedAdsFrequency = Object.entries(adsFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [ads, count]) => ({ ...acc, [ads]: count }), {});
    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedInstitucionFrequency,
        orderedAdsFrequency,
      ],
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const busquedaArea = async (req, res) => {
  const busqueda = req.query.search.replace(/\+/g, " ");
  console.log(busqueda);
  try {
    const resultados = await Documents.find({
      Área: { $regex: `(${busqueda})`, $options: "i" },
    });
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};
    const clavesResultados = Object.keys(resultados[0]._doc);

    resultados.forEach((ps) => {
      const pais = ps["País de la Publicación"];
      if (pais !== undefined) {
        paisFrequency[pais] = (paisFrequency[pais] || 0) + 1;
      }
    });

    resultados.forEach((insti) => {
      const inst = insti["Campo"];
      if (inst !== undefined) {
        institucionFrequency[inst] = (institucionFrequency[inst] || 0) + 1;
      }
    });

    resultados.forEach((adsc) => {
      const ads = adsc["Tipo de documento"];
      if (ads !== undefined) {
        adsFrequency[ads] = (adsFrequency[ads] || 0) + 1;
      }
    });

    // Ordenar las frecuencias de menor a mayor
    const orderedPaisFrequency = Object.entries(paisFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [pais, count]) => ({ ...acc, [pais]: count }), {});

    const orderedInstitucionFrequency = Object.entries(institucionFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce(
        (acc, [institucion, count]) => ({ ...acc, [institucion]: count }),
        {}
      );

    const orderedAdsFrequency = Object.entries(adsFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [ads, count]) => ({ ...acc, [ads]: count }), {});
    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedInstitucionFrequency,
        orderedAdsFrequency,
      ],
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const busquedaTipoDocumento = async (req, res) => {
  const busqueda = req.query.search.replace(/\+/g, " ");
  console.log(busqueda);
  try {
    const resultados = await Documents.find({
      "Tipo de documento": { $regex: `(${busqueda})`, $options: "i" },
    });
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};
    const clavesResultados = Object.keys(resultados[0]._doc);

    resultados.forEach((ps) => {
      const pais = ps["País de la Publicación"];
      if (pais !== undefined) {
        paisFrequency[pais] = (paisFrequency[pais] || 0) + 1;
      }
    });

    resultados.forEach((insti) => {
      const inst = insti["Área"];
      if (inst !== undefined) {
        institucionFrequency[inst] = (institucionFrequency[inst] || 0) + 1;
      }
    });

    resultados.forEach((adsc) => {
      const ads = adsc["Campo"];
      if (ads !== undefined) {
        adsFrequency[ads] = (adsFrequency[ads] || 0) + 1;
      }
    });

    // Ordenar las frecuencias de menor a mayor
    const orderedPaisFrequency = Object.entries(paisFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [pais, count]) => ({ ...acc, [pais]: count }), {});

    const orderedInstitucionFrequency = Object.entries(institucionFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce(
        (acc, [institucion, count]) => ({ ...acc, [institucion]: count }),
        {}
      );

    const orderedAdsFrequency = Object.entries(adsFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [ads, count]) => ({ ...acc, [ads]: count }), {});
    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedInstitucionFrequency,
        orderedAdsFrequency,
      ],
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const busquedaPais = async (req, res) => {
  const busqueda = req.query.search.replace(/\+/g, " ");
  console.log(busqueda);
  try {
    const resultados = await Documents.find({
      "País de la Publicación": { $regex: `(${busqueda})`, $options: "i" },
    });
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};
    const clavesResultados = Object.keys(resultados[0]._doc);

    resultados.forEach((ps) => {
      const pais = ps["Área"];
      if (pais !== undefined) {
        paisFrequency[pais] = (paisFrequency[pais] || 0) + 1;
      }
    });

    resultados.forEach((insti) => {
      const inst = insti["Campo"];
      if (inst !== undefined) {
        institucionFrequency[inst] = (institucionFrequency[inst] || 0) + 1;
      }
    });

    resultados.forEach((adsc) => {
      const ads = adsc["Tipo de documento"];
      if (ads !== undefined) {
        adsFrequency[ads] = (adsFrequency[ads] || 0) + 1;
      }
    });

    // Ordenar las frecuencias de menor a mayor
    const orderedPaisFrequency = Object.entries(paisFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [pais, count]) => ({ ...acc, [pais]: count }), {});

    const orderedInstitucionFrequency = Object.entries(institucionFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce(
        (acc, [institucion, count]) => ({ ...acc, [institucion]: count }),
        {}
      );

    const orderedAdsFrequency = Object.entries(adsFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [ads, count]) => ({ ...acc, [ads]: count }), {});
    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedInstitucionFrequency,
        orderedAdsFrequency,
      ],
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const chartsBusquedaAutor = async (req, res) => {
  // const municipio = req.query.search;
  const autor = req.query.search.replace(/\+/g, " ");
  try {
    const autores = await Autores.find({
      Autor: { $regex: `(${autor})`, $options: "i" },
    });
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};

    autores.forEach((ps) => {
      const pais = ps["País"];
      if (pais !== undefined) {
        paisFrequency[pais] = (paisFrequency[pais] || 0) + 1;
      }
    });

    autores.forEach((insti) => {
      const inst = insti["INST"];
      if (inst !== undefined) {
        institucionFrequency[inst] = (institucionFrequency[inst] || 0) + 1;
      }
    });

    autores.forEach((adsc) => {
      const ads = adsc["ADS"];
      if (ads !== undefined) {
        adsFrequency[ads] = (adsFrequency[ads] || 0) + 1;
      }
    });
    console.log(adsFrequency);
    // Ordenar las frecuencias de menor a mayor
    const orderedPaisFrequency = Object.entries(paisFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [pais, count]) => ({ ...acc, [pais]: count }), {});

    const orderedInstitucionFrequency = Object.entries(institucionFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce(
        (acc, [institucion, count]) => ({ ...acc, [institucion]: count }),
        {}
      );

    const orderedAdsFrequency = Object.entries(adsFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [ads, count]) => ({ ...acc, [ads]: count }), {});

    res.send([
      orderedPaisFrequency,
      orderedInstitucionFrequency,
      orderedAdsFrequency,
    ]);
  } catch (error) {
    res.status(500).send({ error: "Error al procesar la solicitud" });
  }
};

export const chartsBusquedaRevista = async (req, res) => {
  // const municipio = req.query.search;
  const autor = req.query.search.replace(/\+/g, " ");
  try {
    const autores = await Autores.find({
      Autor: { $regex: `(${autor})`, $options: "i" },
    });
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};

    autores.forEach((ps) => {
      const pais = ps["País"];
      if (pais !== undefined) {
        paisFrequency[pais] = (paisFrequency[pais] || 0) + 1;
      }
    });

    autores.forEach((insti) => {
      const inst = insti["INST"];
      if (inst !== undefined) {
        institucionFrequency[inst] = (institucionFrequency[inst] || 0) + 1;
      }
    });

    autores.forEach((adsc) => {
      const ads = adsc["ADS"];
      if (ads !== undefined) {
        adsFrequency[ads] = (adsFrequency[ads] || 0) + 1;
      }
    });
    console.log(adsFrequency);
    // Ordenar las frecuencias de menor a mayor
    const orderedPaisFrequency = Object.entries(paisFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [pais, count]) => ({ ...acc, [pais]: count }), {});

    const orderedInstitucionFrequency = Object.entries(institucionFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce(
        (acc, [institucion, count]) => ({ ...acc, [institucion]: count }),
        {}
      );

    const orderedAdsFrequency = Object.entries(adsFrequency)
      .sort(([, aCount], [, bCount]) => aCount - bCount)
      .reduce((acc, [ads, count]) => ({ ...acc, [ads]: count }), {});

    res.send([
      orderedPaisFrequency,
      orderedInstitucionFrequency,
      orderedAdsFrequency,
    ]);
  } catch (error) {
    res.status(500).send({ error: "Error al procesar la solicitud" });
  }
};

export const infoBusquedaSecciones = async (req, res) => {
  try {
    const allDocuments = await Documents.find({}).exec();
    const allAutores = await Autores.find({}).exec();

    const totalDocumentos = allDocuments.length;
    const totalAutores = allAutores.length;

    // Obtener conteo de revistas únicas
    const revistasSet = new Set();
    allDocuments.forEach((document) => {
      const revista = document["Nombre de la revista/libro"];
      if (revista) {
        revistasSet.add(revista);
      }
    });
    const totalRevistas = revistasSet.size;

    // Obtener áreas únicas y ordenarlas alfabéticamente
    const areasSet = new Set();
    allDocuments.forEach((document) => {
      const area = document["Área"];
      if (area) {
        areasSet.add(area);
      }
    });
    const orderedAreas = Array.from(areasSet).sort();

    // Obtener tipos de documento únicos y ordenarlos alfabéticamente
    const tiposDocumentoSet = new Set();
    allDocuments.forEach((document) => {
      const tipoDocumento = document["Tipo de documento"];
      if (tipoDocumento) {
        tiposDocumentoSet.add(tipoDocumento);
      }
    });
    const orderedTiposDocumento = Array.from(tiposDocumentoSet).sort();

    // Obtener países únicos y ordenarlos alfabéticamente
    const paisesSet = new Set();
    allDocuments.forEach((document) => {
      const pais = document["País de la Publicación"];
      if (pais) {
        paisesSet.add(pais);
      }
    });
    const orderedPaises = Array.from(paisesSet).sort();
    const totalPaises = paisesSet.size;

    // Obtener editoriales únicas y ordenarlos alfabéticamente
    const editorialSet = new Set();
    allDocuments.forEach((document) => {
      const editorial = document["Libros/Editorial"];
      if (editorial) {
        editorialSet.add(editorial);
      }
    });
    const orderedEditorial = Array.from(editorialSet).sort();

    // Obtener instituciones únicas y ordenarlos alfabéticamente
    const instiSet = new Set();
    allDocuments.forEach((document) => {
      const insti = document["Tesis/ Institución"];
      if (insti) {
        instiSet.add(insti);
      }
    });
    const orderedInsti = Array.from(instiSet).sort();

    // Construir el objeto de respuesta en el formato deseado
    const areasResponse = orderedAreas.map((area, index) => ({
      value: (index + 1).toString(),
      label: area,
    }));

    const tiposDocumentoResponse = orderedTiposDocumento.map((tipo, index) => ({
      value: (index + 1).toString(),
      label: tipo,
    }));

    const paisesResponse = orderedPaises.map((pais, index) => ({
      value: (index + 1).toString(),
      label: pais,
    }));

    const editorialResponse = orderedEditorial.map((editorial, index) => ({
      value: (index + 1).toString(),
      label: editorial,
    }));

    const instiResponse = orderedInsti.map((institucion, index) => ({
      value: (index + 1).toString(),
      label: institucion,
    }));

    const indicadores = [
      {
        documentos: totalDocumentos,
        revistas: totalRevistas,
        paises: totalPaises,
        autores: totalAutores,
      },
    ];

    res.send({
      indicadores: indicadores,
      areas: areasResponse,
      tipos: tiposDocumentoResponse,
      paises: paisesResponse,
      editoriales: editorialResponse,
      instituciones: instiResponse,
    });
  } catch (error) {
    // Manejar errores
    res.status(500).send({ error: "Error al procesar la solicitud" });
  }
};
