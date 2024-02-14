import Autores from '../models/autores.model.js';


export const getAutores = async (req, res) => {
    try {
      const autores = await Autores.find().lean();
  
      if (autores.length > 0) {
        
        const encabezados = Object.keys(autores[0]);
        
        res.send([encabezados,autores]);
      } else {
        
        res.status(404).send({ message: "No se encontraron autores" });
      }
    } catch (error) {
      res.status(500).send({ message: "Error al obtener autores", error: error.message });
    }
  };
  
  
  
  
