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

export const getCountriesAndYears = async (req, res) => {
  try {
    const allDocuments = await Documents.find().exec();

    // Crear un objeto para realizar el conteo de años
    const yearCounts = {};

    // Iterar sobre los documentos y contar las apariciones de cada año
    allDocuments.forEach((document) => {
      const year = document.year; // Asegúrate de que el nombre del campo sea correcto
      if (yearCounts[year]) {
        yearCounts[year] += 1;
      } else {
        yearCounts[year] = 1;
      }
    });

    // Obtener los años distintos
    const distinctYears = Object.keys(yearCounts);

    // Crear un array de años con sus respectivos conteos
    const years = distinctYears.map((year) => {
      return { "name_es": year, count: yearCounts[year] };
    });

    const XLabels = years.map((label) => label.count)
    const YLabels = years.map((label) => label["name_es"])


    // Obtener los países de la publicación como en tu función original
    const distinctCountries = await Documents.distinct("pais de la publicación").exec();
    const countries = distinctCountries.map((country) => {
      return { "name_es": country };
    });

    // Enviar la respuesta con los países y el conteo de años
    res.send([countries,years,YLabels,XLabels]);
  } catch (error) {
    res.send(error);
  }
};


 


