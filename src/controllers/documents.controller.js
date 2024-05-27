import Documents from "../models/document.model.js";
import Autores from "../models/autores.model.js";

//   try {
//     const [
//       totalDocumentos,
//       totalAutores,
//       distinctRevistas,
//       distinctAreas,
//       distinctPaises,
//     ] = await Promise.all([
//       Documents.countDocuments(),
//       Autores.countDocuments(),
//       Documents.distinct("Nombre de la revista/libro"),
//       Documents.distinct("Área"),
//       Documents.distinct("País de la Publicación"),
//     ]);

//     const totalRevistas = distinctRevistas.length;
//     const totalPaises = distinctPaises.length;

//     const areasResponse = distinctAreas.map((area, index) => ({
//       value: (index + 1).toString(),
//       label: area,
//     }));

//     const paisesResponse = distinctPaises.map((pais, index) => ({
//       value: (index + 1).toString(),
//       label: pais,
//     }));

//     const indicadores = [
//       {
//         documentos: totalDocumentos,
//         revistas: totalRevistas,
//         paises: totalPaises,
//         autores: totalAutores,
//       },
//     ];

//     res.send({
//       indicadores: indicadores,
//       areas: areasResponse,
//       paises: paisesResponse,
//     });
//   } catch (error) {
//     console.error("Error al procesar la solicitud:", error);
//     res.status(500).send({ error: "Error al procesar la solicitud" });
//   }
// };
export const secciones_busqueda = async (req, res) => {
  try {
    const [
      totalDocumentos,
      totalAutores,
      distinctRevistas,
      distinctAreas,
      distinctPaises,
      paisesResult,
      municipiosResult,
    ] = await Promise.all([
      Documents.countDocuments(),
      Autores.countDocuments(),
      Documents.distinct("Nombre de la revista/libro"),
      Documents.distinct("Área"),
      Documents.distinct("País de la Publicación"),
      Documents.aggregate([
        {
          $group: {
            _id: "$País de la Publicación",
            count: { $sum: 1 },
          },
        },
      ]).sort({ count: -1 }),
      Documents.aggregate([
        {
          $addFields: {
            municipios: { $split: ["$Municipios de estudio", ", "] },
          },
        },
        {
          $unwind: "$municipios",
        },
        {
          $group: {
            _id: "$municipios",
            count: { $sum: 1 },
          },
        },
      ]).sort({ count: -1 }),
    ]);

    const totalRevistas = distinctRevistas.length;
    const totalPaises = distinctPaises.length;

    const areasResponse = distinctAreas.map((area, index) => ({
      value: (index + 1).toString(),
      label: area,
    }));

    const paisesResponse = distinctPaises.map((pais, index) => ({
      value: (index + 1).toString(),
      label: pais,
    }));

    const indicadores = [
      {
        documentos: totalDocumentos,
        revistas: totalRevistas,
        paises: totalPaises,
        autores: totalAutores,
      },
    ];

    const graficosPaises = paisesResult.map((value) => ({
      name_es: value._id,
      count: value.count,
    }));

    const graficosMunicipios = municipiosResult.map((value) => ({
      name_es: value._id,
      count: value.count,
    }));

    const labelsPaises = {
      YLabels: graficosPaises.map((label) => label.name_es),
      XLabels: graficosPaises.map((label) => label.count),
    };

    const labelsMunicipios = {
      YLabels: graficosMunicipios.map((label) => label.name_es),
      XLabels: graficosMunicipios.map((label) => label.count),
    };

    res.send({
      indicadores: indicadores,
      areas: areasResponse,
      paises: paisesResponse,
      graficosPaises: { finalResult: graficosPaises, labels: labelsPaises },
      graficosMunicipios: {
        finalResult: graficosMunicipios,
        labels: labelsMunicipios,
      },
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).send({ error: "Error al procesar la solicitud" });
  }
};
export const busqueda_paises = async (req, res) => {
  const pais = req.query.search;
  try {
    const resultados = await Documents.aggregate([
      {
        $match: {
          "País de la Publicación": { $regex: new RegExp(pais, "i") },
        },
      },
      {
        $sort: { Año: 1 },
      },
      {
        $project: {
          _id: 0,
          "Link de acceso": 1,
          "Nombre de la revista/libro": 1,
          Título: 1,
          Idioma: 1,
          Año: 1,
          Autores: 1,
          "País de la Publicación": 1,
          Área: 1,
          "Tipo de documento": 1,
          Campo: 1,
          Disciplina: 1,
        },
      },
    ]);
    const clavesResultados = Object.keys(resultados[0]).filter(
      (clave) => clave !== "Área" && clave !== "Tipo de documento"
    );

    const paises = resultados.map(
      (resultado) => resultado["País de la Publicación"]
    );
    const paisFrequency = paises.reduce((acc, pais) => {
      acc[pais] = (acc[pais] || 0) + 1;
      return acc;
    }, {});
    const orderedPaisFrequency = Object.fromEntries(
      Object.entries(paisFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const areas = resultados.map((resultado) => resultado["Área"]);
    const areaFrequency = areas.reduce((acc, area) => {
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});
    const orderedAreaFrequency = Object.fromEntries(
      Object.entries(areaFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const tiposDocumento = resultados.map(
      (resultado) => resultado["Tipo de documento"]
    );
    const tiposDocumentoFrequency = tiposDocumento.reduce((acc, tipo) => {
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});
    const orderedTipoDocumentoFrequency = Object.fromEntries(
      Object.entries(tiposDocumentoFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedAreaFrequency,
        orderedTipoDocumentoFrequency,
      ],
    });
  } catch (error) {
    res.send(error);
  }
};
export const busqueda_municipios = async (req, res) => {
  const municipio = req.query.search;
  try {
    const resultados = await Documents.aggregate([
      {
        $match: {
          "Municipios de estudio": { $regex: new RegExp(municipio, "i") },
        },
      },
      {
        $sort: { Año: 1 },
      },
      {
        $project: {
          _id: 0,
          "Link de acceso": 1,
          "Nombre de la revista/libro": 1,
          Título: 1,
          Idioma: 1,
          Año: 1,
          Autores: 1,
          "País de la Publicación": 1,
          Área: 1,
          "Tipo de documento": 1,
          Campo: 1,
          Disciplina: 1,
        },
      },
    ]);

    const clavesResultados = Object.keys(resultados[0]).filter(
      (clave) => clave !== "Área" && clave !== "Tipo de documento"
    );

    const paises = resultados.map(
      (resultado) => resultado["País de la Publicación"]
    );
    const paisFrequency = paises.reduce((acc, pais) => {
      acc[pais] = (acc[pais] || 0) + 1;
      return acc;
    }, {});
    const orderedPaisFrequency = Object.fromEntries(
      Object.entries(paisFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const areas = resultados.map((resultado) => resultado["Área"]);
    const areaFrequency = areas.reduce((acc, area) => {
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});
    const orderedAreaFrequency = Object.fromEntries(
      Object.entries(areaFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const tiposDocumento = resultados.map(
      (resultado) => resultado["Tipo de documento"]
    );
    const tiposDocumentoFrequency = tiposDocumento.reduce((acc, tipo) => {
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});
    const orderedTipoDocumentoFrequency = Object.fromEntries(
      Object.entries(tiposDocumentoFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedAreaFrequency,
        orderedTipoDocumentoFrequency,
      ],
    });
  } catch (error) {
    res.send(error);
  }
};
export const busqueda_general = async (req, res) => {
  const busquedaArray = req.query.search.split("+");
  const busquedaRegex = busquedaArray.map(
    (term) => new RegExp("\\b" + term.replace(/\+/g, " ") + "\\b", "i")
  );

  try {
    const resultados = await Documents.aggregate([
      {
        $match: {
          $or: [
            { Título: { $in: busquedaRegex } },
            { "Tipo de autoría": { $in: busquedaRegex } },
            {
              Autores: {
                $regex: busquedaRegex.join("|").replace(/ /g, "\\s*,\\s*"),
                $options: "i",
              },
            },
            { "Tipo de documento": { $in: busquedaRegex } },
            { Clasificación: { $in: busquedaRegex } },
            { "Nombre de la revista/libro": { $in: busquedaRegex } },
            {
              "Compilador/ Editor/ Coordinador/ Libro": { $in: busquedaRegex },
            },
            { "País de la Publicación": { $in: busquedaRegex } },
            { "Libros/Editorial": { $in: busquedaRegex } },
            { "Tesis/ Institución": { $in: busquedaRegex } },
            { "Tipo de consulta": { $in: busquedaRegex } },
            { Área: { $in: busquedaRegex } },
            { Campo: { $in: busquedaRegex } },
            { Disciplina: { $in: busquedaRegex } },
            { "Municipios de estudio": { $in: busquedaRegex } },
            {
              "Palabras Clave": {
                $regex: busquedaRegex.join("|").replace(/ /g, "\\s*,\\s*"),
                $options: "i",
              },
            },
            { Disponibilidad: { $in: busquedaRegex } },
            {
              Idioma: {
                $regex: busquedaRegex.join("|").replace(/ /g, "\\s*,\\s*"),
                $options: "i",
              },
            },
          ],
        },
      },
      { $sort: { Año: 1 } },
      {
        $project: {
          _id: 0,
          "Link de acceso": 1,
          "Nombre de la revista/libro": 1,
          Título: 1,
          Idioma: 1,
          Año: 1,
          Autores: 1,
          "País de la Publicación": 1,
          Área: 1,
          "Tipo de documento": 1,
          Campo: 1,
          Disciplina: 1,
        },
      },
    ]);

    const clavesResultados = Object.keys(resultados[0]).filter(
      (clave) => clave !== "Área" && clave !== "Tipo de documento"
    );

    const paises = resultados.map(
      (resultado) => resultado["País de la Publicación"]
    );
    const paisFrequency = paises.reduce((acc, pais) => {
      acc[pais] = (acc[pais] || 0) + 1;
      return acc;
    }, {});
    const orderedPaisFrequency = Object.fromEntries(
      Object.entries(paisFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const areas = resultados.map((resultado) => resultado["Área"]);
    const areaFrequency = areas.reduce((acc, area) => {
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});
    const orderedAreaFrequency = Object.fromEntries(
      Object.entries(areaFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const tiposDocumento = resultados.map(
      (resultado) => resultado["Tipo de documento"]
    );
    const tiposDocumentoFrequency = tiposDocumento.reduce((acc, tipo) => {
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});
    const orderedTipoDocumentoFrequency = Object.fromEntries(
      Object.entries(tiposDocumentoFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedAreaFrequency,
        orderedTipoDocumentoFrequency,
      ],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
export const busqueda_areas = async (req, res) => {
  const area = req.query.search.replace(/\+/g, " ");
  try {
    const resultados = await Documents.aggregate([
      {
        $match: {
          Área: { $regex: new RegExp(area, "i") },
        },
      },
      {
        $sort: { Año: 1 },
      },
      {
        $project: {
          _id: 0,
          "Link de acceso": 1,
          "Nombre de la revista/libro": 1,
          Título: 1,
          Idioma: 1,
          Año: 1,
          Autores: 1,
          "País de la Publicación": 1,
          Área: 1,
          "Tipo de documento": 1,
          Campo: 1,
          Disciplina: 1,
        },
      },
    ]);
    const clavesResultados = Object.keys(resultados[0]).filter(
      (clave) => clave !== "Área" && clave !== "Tipo de documento"
    );

    const paises = resultados.map(
      (resultado) => resultado["País de la Publicación"]
    );
    const paisFrequency = paises.reduce((acc, pais) => {
      acc[pais] = (acc[pais] || 0) + 1;
      return acc;
    }, {});
    const orderedPaisFrequency = Object.fromEntries(
      Object.entries(paisFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const areas = resultados.map((resultado) => resultado["Área"]);
    const areaFrequency = areas.reduce((acc, area) => {
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});
    const orderedAreaFrequency = Object.fromEntries(
      Object.entries(areaFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const tiposDocumento = resultados.map(
      (resultado) => resultado["Tipo de documento"]
    );
    const tiposDocumentoFrequency = tiposDocumento.reduce((acc, tipo) => {
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});
    const orderedTipoDocumentoFrequency = Object.fromEntries(
      Object.entries(tiposDocumentoFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedAreaFrequency,
        orderedTipoDocumentoFrequency,
      ],
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
export const busqueda_revistas = async (req, res) => {
  const revista = req.query.search.replace(/\+/g, " ");
  try {
    const resultados = await Documents.aggregate([
      {
        $match: {
          "Nombre de la revista/libro": { $regex: new RegExp(revista, "i") },
        },
      },
      {
        $group: {
          _id: "$Nombre de la revista/libro",
          "Link de acceso": { $first: "$Link de acceso" },
          Título: { $first: "$Título" },
          Idioma: { $first: "$Idioma" },
          Año: { $first: "$Año" },
          Autores: { $first: "$Autores" },
          "País de la Publicación": { $first: "$País de la Publicación" },
          Área: { $first: "$Área" },
          "Tipo de documento": { $first: "$Tipo de documento" },
          Campo: { $first: "$Campo" },
          Disciplina: { $first: "$Disciplina" },
        },
      },
      { $sort: { Año: 1 } },
      {
        $project: {
          _id: 0,
          "Link de acceso": 1,
          "Nombre de la revista/libro": "$_id",
          Título: 1,
          Idioma: 1,
          Año: 1,
          Autores: 1,
          "País de la Publicación": 1,
          Área: 1,
          "Tipo de documento": 1,
          Campo: 1,
          Disciplina: 1,
        },
      },
    ]);

    const clavesResultados = Object.keys(resultados[0]).filter(
      (clave) => clave !== "Área" && clave !== "Tipo de documento"
    );

    const paises = resultados.map(
      (resultado) => resultado["País de la Publicación"]
    );
    const paisFrequency = paises.reduce((acc, pais) => {
      acc[pais] = (acc[pais] || 0) + 1;
      return acc;
    }, {});
    const orderedPaisFrequency = Object.fromEntries(
      Object.entries(paisFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const areas = resultados.map((resultado) => resultado["Área"]);
    const areaFrequency = areas.reduce((acc, area) => {
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});
    const orderedAreaFrequency = Object.fromEntries(
      Object.entries(areaFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const tiposDocumento = resultados.map(
      (resultado) => resultado["Tipo de documento"]
    );
    const tiposDocumentoFrequency = tiposDocumento.reduce((acc, tipo) => {
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});
    const orderedTipoDocumentoFrequency = Object.fromEntries(
      Object.entries(tiposDocumentoFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedAreaFrequency,
        orderedTipoDocumentoFrequency,
      ],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "No hay coincidencias en la base de datos." });
  }
};
export const busqueda_documentos_revistas = async (req, res) => {
  const revista = req.query.search.replace(/\+/g, " ");
  try {
    const resultados = await Documents.aggregate([
      {
        $match: {
          "Nombre de la revista/libro": { $regex: new RegExp(revista, "i") },
        },
      },
      { $sort: { Año: 1 } },
      {
        $project: {
          _id: 0,
          "Link de acceso": 1,
          "Nombre de la revista/libro": 1,
          Título: 1,
          Idioma: 1,
          Año: 1,
          Autores: 1,
          "País de la Publicación": 1,
          Área: 1,
          "Tipo de documento": 1,
          Campo: 1,
          Disciplina: 1,
        },
      },
    ]);

    const clavesResultados = Object.keys(resultados[0]).filter(
      (clave) => clave !== "Área" && clave !== "Tipo de documento"
    );

    const paises = resultados.map(
      (resultado) => resultado["País de la Publicación"]
    );
    const paisFrequency = paises.reduce((acc, pais) => {
      acc[pais] = (acc[pais] || 0) + 1;
      return acc;
    }, {});
    const orderedPaisFrequency = Object.fromEntries(
      Object.entries(paisFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const areas = resultados.map((resultado) => resultado["Área"]);
    const areaFrequency = areas.reduce((acc, area) => {
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});
    const orderedAreaFrequency = Object.fromEntries(
      Object.entries(areaFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const tiposDocumento = resultados.map(
      (resultado) => resultado["Tipo de documento"]
    );
    const tiposDocumentoFrequency = tiposDocumento.reduce((acc, tipo) => {
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});
    const orderedTipoDocumentoFrequency = Object.fromEntries(
      Object.entries(tiposDocumentoFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedAreaFrequency,
        orderedTipoDocumentoFrequency,
      ],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "No hay coincidencias en la base de datos." });
  }
};
export const busqueda_documentos_autores = async (req, res) => {
  const autor = req.query.search.replace(/\+/g, " ");
  try {
    const resultados = await Documents.aggregate([
      {
        $match: {
          Autores: { $regex: new RegExp(autor, "i") },
        },
      },
      { $sort: { Año: 1 } },
      {
        $project: {
          _id: 0,
          "Link de acceso": 1,
          "Nombre de la revista/libro": 1,
          Título: 1,
          Idioma: 1,
          Año: 1,
          Autores: 1,
          "País de la Publicación": 1,
          Área: 1,
          "Tipo de documento": 1,
          Campo: 1,
          Disciplina: 1,
        },
      },
    ]);

    const clavesResultados = Object.keys(resultados[0]).filter(
      (clave) => clave !== "Área" && clave !== "Tipo de documento"
    );

    const paises = resultados.map(
      (resultado) => resultado["País de la Publicación"]
    );
    const paisFrequency = paises.reduce((acc, pais) => {
      acc[pais] = (acc[pais] || 0) + 1;
      return acc;
    }, {});
    const orderedPaisFrequency = Object.fromEntries(
      Object.entries(paisFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const areas = resultados.map((resultado) => resultado["Área"]);
    const areaFrequency = areas.reduce((acc, area) => {
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});
    const orderedAreaFrequency = Object.fromEntries(
      Object.entries(areaFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const tiposDocumento = resultados.map(
      (resultado) => resultado["Tipo de documento"]
    );
    const tiposDocumentoFrequency = tiposDocumento.reduce((acc, tipo) => {
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});
    const orderedTipoDocumentoFrequency = Object.fromEntries(
      Object.entries(tiposDocumentoFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedAreaFrequency,
        orderedTipoDocumentoFrequency,
      ],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "No hay coincidencias en la base de datos." });
  }
};
export const busqueda_autores = async (req, res) => {
  const busqueda = req.query.search.replace(/\+/g, " ");

  try {
    const resultados = await Autores.aggregate([
      {
        $match: {
          Autor: { $regex: new RegExp(busqueda, "i") },
        },
      },
      {
        $sort: { Autor: 1 },
      },
      {
        $project: {
          _id: 0,
          Autor: 1,
        },
      },
    ]);
    const clavesResultados = Object.keys(resultados[0]).filter(
      (clave) => clave !== "Área" && clave !== "Tipo de documento"
    );

    const paises = resultados.map(
      (resultado) => resultado["País de la Publicación"]
    );
    const paisFrequency = paises.reduce((acc, pais) => {
      acc[pais] = (acc[pais] || 0) + 1;
      return acc;
    }, {});
    const orderedPaisFrequency = Object.fromEntries(
      Object.entries(paisFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const areas = resultados.map((resultado) => resultado["Área"]);
    const areaFrequency = areas.reduce((acc, area) => {
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});
    const orderedAreaFrequency = Object.fromEntries(
      Object.entries(areaFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    const tiposDocumento = resultados.map(
      (resultado) => resultado["Tipo de documento"]
    );
    const tiposDocumentoFrequency = tiposDocumento.reduce((acc, tipo) => {
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});
    const orderedTipoDocumentoFrequency = Object.fromEntries(
      Object.entries(tiposDocumentoFrequency).sort(
        ([, aCount], [, bCount]) => aCount - bCount
      )
    );

    res.send({
      resultados: resultados,
      tableTitle: clavesResultados,
      dt: [
        orderedPaisFrequency,
        orderedAreaFrequency,
        orderedTipoDocumentoFrequency,
      ],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
