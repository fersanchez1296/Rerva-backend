import Documents from '../models/document.model.js'

export const getDocuments = async(req,res) => {
    const search = req.query.search;
    try {
        const getDocument = await Documents.find({
            $or: [
             { Autores: { $regex: search, $options : "i" } },
             { "Título": { $regex: search, $options : "i" } },
             { "Temática": { $regex: search, $options : "i" } },
             { "País de la Publicación": { $regex: search, $options : "i" } },
             { "Nombre de la revista/libro": { $regex: search, $options : "i" } },
             { "Tipo de documento": { $regex: search, $options : "i" } },
             { "Libros/Editorial": { $regex: search, $options : "i" } },
             { "Compilador/ Editor/ Coordinador/ Libro": { $regex: search, $options : "i" } },
             { "Municipios de estudio": { $regex: search, $options : "i" } } 
            ]
          })
        res.send(getDocument) 
    } catch (error) {
        res.send(error)
    }
}

export const postDocument = (req, res) => {
    res.send(">>>Agregando")
}