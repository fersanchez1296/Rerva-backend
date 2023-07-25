import Documents from '../models/document.model.js'

export const getDocuments = async(req,res) => {
    const search = req.query.search;
    try {
        const getDocument = await Documents.find({
            $or: [
             { "coautor": { $regex: search, $options : "i" } },
             { "autor principal": { $regex: search, $options : "i" } },
             { "titulo": { $regex: search, $options : "i" } },
             { "tema": { $regex: search, $options : "i" } },
             { "país de la publicación": { $regex: search, $options : "i" } },
             { "nombre de la revista o libro": { $regex: search, $options : "i" } },
             { "tipo de documento": { $regex: search, $options : "i" } },
             { "libros-editorial": { $regex: search, $options : "i" } },
             { "compilador-editor-coordinador-libro": { $regex: search, $options : "i" } },
             { "territorio analizado": { $regex: search, $options : "i" } } 
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