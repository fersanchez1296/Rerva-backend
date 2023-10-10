import Documents from '../models/document.model.js';

export const getCountries = async (req, res) => {
  try {
    const distinctCountries = await Documents.distinct("pais de la publicación").exec();
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
          _id: "$pais de la publicación",
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
    const countriesData = await Documents.find({"pais de la publicación" : { $regex: search, $options : "i" }})
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
      const year = document.year; // Asegúrate de que el nombre del campo sea correcto
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
    const distinctCountries = await Documents.distinct("pais de la publicación").exec();
    const countries = distinctCountries.map((country) => {
      return { "name_es": country };
    });

    // Enviar la respuesta con los países y el conteo de décadas
    res.send([countries, decades, YLabels, XLabels]);
  } catch (error) {
    res.send(error);
  }
};



 


