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
    const resultadosFiltrados = resultados.map((item) => ({
      "Link de acceso" : item["Link de acceso"],
      "Nombre de la revista/libro": item["Nombre de la revista/libro"],
      Título: item["Título"],
      Idioma: item.Idioma,
      Año: item["Año"],
      "Tipo de autoría": item["Tipo de autoría"],
      Autores: item.Autores,
    }));
    const clavesResultados = Object.keys(resultadosFiltrados[0]);

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
    const resultadosFiltrados = resultados.map((item) => ({
      "Link de acceso" : item["Link de acceso"],
      "Nombre de la revista/libro": item["Nombre de la revista/libro"],
      Título: item["Título"],
      Idioma: item.Idioma,
      Año: item["Año"],
      "Tipo de autoría": item["Tipo de autoría"],
      Autores: item.Autores,
      "País de la Publicación": item["País de la Publicación"],
    }));
    const clavesResultados = Object.keys(resultadosFiltrados[0]);

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

    const resultadosFiltrados = resultados.map((item) => ({
      "Link de acceso" : item["Link de acceso"],
      "Nombre de la revista/libro": item["Nombre de la revista/libro"],
      Título: item["Título"],
      Idioma: item.Idioma,
      Año: item["Año"],
      "Tipo de autoría": item["Tipo de autoría"],
      Autores: item.Autores,
      "País de la Publicación": item["País de la Publicación"],
    }));
    const clavesResultados = Object.keys(resultadosFiltrados[0]);
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
    const resultadosFiltrados = resultados.map((item) => ({
      Autor: item.Autores,
    }));
    const clavesResultados = Object.keys(resultadosFiltrados[0]);
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};

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
    }).sort({ "Nombre de la revista/libro": 1 });

    
    const resultSelectDistinct = resultados.filter(
      (resultado, index, self) =>
        index ===
        self.findIndex(
          (r) =>
            r["Nombre de la revista/libro"] ===
            resultado["Nombre de la revista/libro"]
        )
    );
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};
    const resultadosFiltrados = resultados.map((item) => ({
      "Nombre de la revista/libro": item["Nombre de la revista/libro"],
      Idioma: item.Idioma,
      Año: item["Año"],
      "País de la Publicación": item["País de la Publicación"],
    }));
    const clavesResultados = Object.keys(resultadosFiltrados[0]);

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
      resultados: resultSelectDistinct,
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

export const busquedaRevistaDocumentos = async (req,res) => {
  const busqueda = req.query.search.replace(/\+/g, " ");

  try {
    const resultados = await Documents.find({
      "Nombre de la revista/libro": { $regex: `(${busqueda})`, $options: "i" },
    });
    const paisFrequency = {};
    const institucionFrequency = {};
    const adsFrequency = {};
    const resultadosFiltrados = resultados.map((item) => ({
      "Link de acceso" : item["Link de acceso"],
      "Título": item["Título"],
      Idioma: item.Idioma,
      Año: item["Año"],
      "País de la Publicación": item["País de la Publicación"],
      Autores: item.Autores,
    }));
    const clavesResultados = Object.keys(resultadosFiltrados[0]);

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
    res.status(500).json({message : "No hay coincidencias en la base de datos."});
  }
}

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
    const resultadosFiltrados = resultados.map((item) => ({
      "Link de acceso" : item["Link de acceso"],
      "Nombre de la revista/libro" : item["Nombre de la revista/libro"],
      "Título": item["Título"],
      Idioma: item.Idioma,
      Año: item["Año"],
      "País de la Publicación": item["País de la Publicación"],
      Autores: item.Autores,
    }));
    const clavesResultados = Object.keys(resultadosFiltrados[0]);

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
    const resultadosFiltrados = resultados.map((item) => ({
      "Link de acceso" : item["Link de acceso"],
      "Nombre de la revista/libro" : item["Nombre de la revista/libro"],
      "Título": item["Título"],
      Idioma: item.Idioma,
      Año: item["Año"],
      Autores: item.Autores,
    }));
    const clavesResultados = Object.keys(resultadosFiltrados[0]);

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
    const [totalDocumentos, totalAutores] = await Promise.all([
      Documents.countDocuments(),
      Autores.countDocuments()
    ]);

    const distinctRevistas = await Documents.distinct("Nombre de la revista/libro");
    const distinctAreas = await Documents.distinct("Área");
    const distinctPaises = await Documents.distinct("País de la Publicación");

    const totalRevistas = distinctRevistas.length;
    const orderedAreas = distinctAreas.sort();
    const orderedPaises = distinctPaises.sort();
    const totalPaises = distinctPaises.length;

    const areasResponse = orderedAreas.map((area, index) => ({
      value: (index + 1).toString(),
      label: area,
    }));

    const paisesResponse = orderedPaises.map((pais, index) => ({
      value: (index + 1).toString(),
      label: pais,
    }));

    const indicadores = [{
      documentos: totalDocumentos,
      revistas: totalRevistas,
      paises: totalPaises,
      autores: totalAutores,
    }];

    res.send({
      indicadores: indicadores,
      areas: areasResponse,
      paises: paisesResponse,
    });
  } catch (error) {
    res.status(500).send({ error: "Error al procesar la solicitud" });
  }
};


