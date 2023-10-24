import Documents from '../models/document.model.js';

export const getCountries = async (req, res) => {
  try {
    const distinctCountries = await Documents.distinct("País de la Publicación").exec();
    const countries = distinctCountries.map((country) => {
      return { "name_es": country };
    });

    res.send(countries);
  } catch (error) {
    res.send(error);
  }
};

export const getCountriesWithCount = async (req, res) => {
  try {
    const countriesWithCounts = await Documents.aggregate([
      {
        $group: {
          _id: "$País de la Publicación",
          count: { $sum: 1 }
        }
      }
    ]);

    const countries = countriesWithCounts.map((country) => ({
      name_es: country._id,
    }));

    const countriesCount = countriesWithCounts.map((country) => ({
      name_es: country._id,
      count: country.count
    }));

    const YLabels = countriesCount.map((label) => label.name_es)
    const XLabels = countriesCount.map((label) => label.count)

    res.send([countries,countriesCount,YLabels,XLabels]);
  } catch (error) {
    res.send(error);
  }
};

export const getCountriesData = async (req, res) => {
  const search = req.query.search;
  try {
    const countriesData = await Documents.find({"País de la Publicación" : { $regex: search, $options : "i" }})
    res.send(countriesData);
  } catch (error) {
    res.send(error);
  }
};

export const getCountriesAndDecades = async (req, res) => {
  try {
    const allDocuments = await Documents.find().exec();

    // Crear un objeto para realizar el conteo de décadas
    const decadeCounts = {};

    // Iterar sobre los documentos y contar las apariciones de cada década
    allDocuments.forEach((document) => {
      const year = document["Año"]; // Asegúrate de que el nombre del campo sea correcto
      const decade = Math.floor(year / 10) * 10; // Agrupar años en décadas
      if (decadeCounts[decade]) {
        decadeCounts[decade] += 1;
      } else {
        decadeCounts[decade] = 1;
      }
    });

    // Obtener las décadas distintas y ordenarlas
    const distinctDecades = Object.keys(decadeCounts).map(Number);
    distinctDecades.sort((a, b) => a - b);

    // Crear un array de décadas con sus respectivos conteos
    const decades = distinctDecades.map((decade) => {
      return { "name_es": `${decade}-${decade + 9}`, count: decadeCounts[decade] };
    });

    const XLabels = decades.map((label) => label.count);
    const YLabels = decades.map((label) => label["name_es"]);

    // Obtener los países de la publicación como en tu función original
    const distinctCountries = await Documents.distinct("País de la Publicación").exec();
    const countries = distinctCountries.map((country) => {
      return { "name_es": country };
    });

    // Enviar la respuesta con los países y el conteo de décadas
    res.send([countries, decades, YLabels, XLabels]);
  } catch (error) {
    res.send(error);
  }
};

export const getCountriesAndAreas = async (req, res) => {
  try {
    const allDocuments = await Documents.find().exec();

    // Crear un objeto para realizar el conteo de áreas
    const areaCounts = {};

    // Iterar sobre los documentos y contar las apariciones de cada área
    allDocuments.forEach((document) => {
      const area = document["Área"]; // Reemplaza 'area' con el nombre del campo correcto
      if (areaCounts[area]) {
        areaCounts[area] += 1;
      } else {
        areaCounts[area] = 1;
      }
    });

    // Obtener las áreas distintas
    const distinctAreas = Object.keys(areaCounts);

    // Crear un array de áreas con sus respectivos conteos
    const areas = distinctAreas.map((area) => {
      return { "name_es": area, count: areaCounts[area] };
    });

    // Ordenar las áreas alfabéticamente si es necesario
    areas.sort((a, b) => a.name_es.localeCompare(b.name_es));

    const XLabels = areas.map((label) => label.count);
    const YLabels = areas.map((label) => label["name_es"]);

    // Obtener los países de la publicación como en tu función original
    const distinctCountries = await Documents.distinct("País de la Publicación").exec();
    const countries = distinctCountries.map((country) => {
      return { "name_es": country };
    });

    // Enviar la respuesta con las áreas y el conteo
    res.send([ countries, areas, YLabels, XLabels ]);
  } catch (error) {
    res.send(error);
  }
};

export const getCountriesAndFieldStudy = async (req, res) => {
  try {
    const allDocuments = await Documents.find().exec();

    // Crear un objeto para realizar el conteo de campos
    const fieldCounts = {};

    // Iterar sobre los documentos y contar las apariciones de cada campo
    allDocuments.forEach((document) => {
      const field = document.Campo; // Reemplaza 'field' con el nombre del campo correcto
      if (fieldCounts[field]) {
        fieldCounts[field] += 1;
      } else {
        fieldCounts[field] = 1;
      }
    });

    // Obtener los campos distintos
    const distinctFields = Object.keys(fieldCounts);

    // Crear un array de campos con sus respectivos conteos
    const fields = distinctFields.map((field) => {
      return { "name_es": field, count: fieldCounts[field] };
    });

    // Ordenar los campos alfabéticamente si es necesario
    fields.sort((a, b) => a.name_es.localeCompare(b.name_es));

    const XLabels = fields.map((label) => label.count);
    const YLabels = fields.map((label) => label["name_es"]);

    // Obtener los países de la publicación como en tu función original
    const distinctCountries = await Documents.distinct("País de la Publicación").exec();
    const countries = distinctCountries.map((country) => {
      return { "name_es": country };
    });

    // Enviar la respuesta con los campos y el conteo
    res.send([ countries, fields, YLabels, XLabels ]);
  } catch (error) {
    res.send(error);
  }
};

export const getCountriesAndDisciplines = async (req, res) => {
  try {
    const allDocuments = await Documents.find().exec();

    // Crear un objeto para realizar el conteo de disciplinas
    const disciplineCounts = {};

    // Iterar sobre los documentos y contar las apariciones de cada disciplina
    allDocuments.forEach((document) => {
      const discipline = document["Disciplina "]; // Reemplaza 'discipline' con el nombre del campo correcto
      if (disciplineCounts[discipline]) {
        disciplineCounts[discipline] += 1;
      } else {
        disciplineCounts[discipline] = 1;
      }
    });

    // Obtener las disciplinas distintas
    const distinctDisciplines = Object.keys(disciplineCounts);

    // Crear un array de disciplinas con sus respectivos conteos
    const disciplines = distinctDisciplines.map((discipline) => {
      return { "name_es": discipline, count: disciplineCounts[discipline] };
    });

    // Ordenar las disciplinas alfabéticamente si es necesario
    disciplines.sort((a, b) => a.name_es.localeCompare(b.name_es));

    const XLabels = disciplines.map((label) => label.count);
    const YLabels = disciplines.map((label) => label["name_es"]);

    // Obtener los países de la publicación como en tu función original
    const distinctCountries = await Documents.distinct("País de la Publicación").exec();
    const countries = distinctCountries.map((country) => {
      return { "name_es": country };
    });

    // Enviar la respuesta con las disciplinas y el conteo
    res.send([ countries, disciplines, YLabels, XLabels ]);
  } catch (error) {
    res.send(error);
  }
};

// TODO
// PENDIENTE DE QUE FUNCIONE

export const getMunicipios = async (req, res) => {
  try {
    const countriesWithCounts = await Documents.aggregate([
      {
        $group: {
          _id: "$Municipios de estudio",
          count: { $sum: 1 }
        }
      }
    ]);

    const countries = countriesWithCounts.map((country) => ({
      name_es: country._id,
    }));

    const countriesCount = countriesWithCounts.map((country) => ({
      name_es: country._id,
      count: country.count
    }));

    const YLabels = countriesCount.map((label) => label.name_es)
    const XLabels = countriesCount.map((label) => label.count)

    res.send([countries,countriesCount,YLabels,XLabels]);
  } catch (error) {
    res.send(error);
  }
};

// TODO
// PENDIENTE DE QUE FUNCIONE

export const getAuthors = async (req,res) => {
  try {
    
  } catch (error) {
    
  }
}

export const getCountriesAndDocumentType = async (req, res) => {
  try {
    const allDocuments = await Documents.find().exec();

    // Crear un objeto para realizar el conteo de tipos de documento
    const documentTypeCounts = {};

    // Iterar sobre los documentos y contar las apariciones de cada tipo de documento
    allDocuments.forEach((document) => {
      const documentType = document["Tipo de documento"]; // Asegúrate de usar el nombre correcto del campo
      if (documentTypeCounts[documentType]) {
        documentTypeCounts[documentType] += 1;
      } else {
        documentTypeCounts[documentType] = 1;
      }
    });

    // Obtener los tipos de documento distintos
    const distinctDocumentTypes = Object.keys(documentTypeCounts);

    // Crear un array de tipos de documento con sus respectivos conteos
    const documentTypes = distinctDocumentTypes.map((documentType) => {
      return { "name_es": documentType, count: documentTypeCounts[documentType] };
    });

    // Ordenar los tipos de documento alfabéticamente si es necesario
    documentTypes.sort((a, b) => a.name_es.localeCompare(b.name_es));

    const XLabels = documentTypes.map((label) => label.count);
    const YLabels = documentTypes.map((label) => label["name_es"]);

    // Obtener los países de la publicación como en tu función original
    const distinctCountries = await Documents.distinct("País de la Publicación").exec();
    const countries = distinctCountries.map((country) => {
      return { "name_es": country };
    });

    // Enviar la respuesta con los tipos de documento y el conteo
    res.send([ countries, documentTypes, YLabels, XLabels ]);
  } catch (error) {
    res.send(error);
  }
};

export const getCountriesAndEditorial = async (req, res) => {
  try {
    const allDocuments = await Documents.find().exec();

    // Crear un objeto para realizar el conteo de libros-editorial
    const librosEditorialCounts = {};

    // Iterar sobre los documentos y contar las apariciones de cada libro-editorial
    allDocuments.forEach((document) => {
      const libroEditorial = document["Libros/Editorial"]; // Asegúrate de usar el nombre correcto del campo
      if (librosEditorialCounts[libroEditorial]) {
        librosEditorialCounts[libroEditorial] += 1;
      } else {
        librosEditorialCounts[libroEditorial] = 1;
      }
    });

    // Obtener los libros-editorial distintos
    const distinctLibrosEditorial = Object.keys(librosEditorialCounts);

    // Crear un array de libros-editorial con sus respectivos conteos
    const librosEditorial = distinctLibrosEditorial.map((libroEditorial) => {
      return { "name_es": libroEditorial, count: librosEditorialCounts[libroEditorial] };
    });

    // Ordenar los libros-editorial alfabéticamente si es necesario
    librosEditorial.sort((a, b) => a.name_es.localeCompare(b.name_es));

    const XLabels = librosEditorial.map((label) => label.count);
    const YLabels = librosEditorial.map((label) => label["name_es"]);

    // Obtener los países de la publicación como en tu función original
    const distinctCountries = await Documents.distinct("País de la Publicación").exec();
    const countries = distinctCountries.map((country) => {
      return { "name_es": country };
    });

    // Enviar la respuesta con los libros-editorial y el conteo
    res.send([ countries, librosEditorial, YLabels, XLabels ]);
  } catch (error) {
    res.send(error);
  }
};

// TODO
// PENDIENTE DE QUE FUNCIONE

export const getCountriesAndInstitution = async (req, res) => {
  try {
    const allDocuments = await Documents.find().exec();

    // Crear un objeto para realizar el conteo de tesis-institución
    const tesisInstitucionCounts = {};

    // Iterar sobre los documentos y contar las apariciones de cada tesis-institución
    allDocuments.forEach((document) => {
      const tesisInstitucion = document["Tesis/ Institución"]; // Asegúrate de usar el nombre correcto del campo
      if (tesisInstitucionCounts[tesisInstitucion]) {
        tesisInstitucionCounts[tesisInstitucion] += 1;
      } else {
        tesisInstitucionCounts[tesisInstitucion] = 1;
      }
    });

    // Obtener las tesis-institución distintas
    const distinctTesisInstitucion = Object.keys(tesisInstitucionCounts);

    // Crear un array de tesis-institución con sus respectivos conteos
    const tesisInstitucion = distinctTesisInstitucion.map((tesisInstitucion) => {
      return { "name_es": tesisInstitucion, count: tesisInstitucionCounts[tesisInstitucion] };
    });

    // Ordenar las tesis-institución alfabéticamente si es necesario
    tesisInstitucion.sort((a, b) => a.name_es.localeCompare(b.name_es));

    const XLabels = tesisInstitucion.map((label) => label.count);
    const YLabels = tesisInstitucion.map((label) => label["name_es"]);

    // Obtener los países de la publicación como en tu función original
    const distinctCountries = await Documents.distinct("País de la Publicación").exec();
    const countries = distinctCountries.map((country) => {
      return { "name_es": country };
    });

    // Enviar la respuesta con las tesis-institución y el conteo
    res.send([ countries, tesisInstitucion, YLabels, XLabels ]);
  } catch (error) {
    res.send(error);
  }
};