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

export const getCountriesData = async (req, res) => {
  const search = req.query.search;
  try {
    const countriesData = await Documents.find({"pais de la publicación" : { $regex: search, $options : "i" }})
    res.send(countriesData);
  } catch (error) {
    res.send(error);
  }
};
