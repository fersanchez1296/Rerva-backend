import mongoose from "mongoose";

const documentSchema = mongoose.Schema(
  {
    "Título": {
      type: String,
      required: true,
      trim: true,
    },
    "Año": {
      type: Number,
      required: true,
      trim: true,
    },
    "Tipo de autoría": {
      type: String,
      required: true,
      trim: true,
    },
    Autores: {
      type: Array,
      trim: true,
    },
    Idioma: {
      type: Array,
      trim: true,
    },
    "Tipo de documento": {
      type: String,
      required: true,
      trim: true,
    },
    "Nombre de la revista/libro": {
      type: String,
      required: true,
      trim: true,
    },
    "País de la Publicación": {
      type: String,
      trim: true,
    },
    "Libros/Editorial": {
      type: String,
      trim: true,
    },
    "Tesis/ Institución": {
      type: String,
      required: true,
      trim: true,
    },
    "Tipo de consulta": {
      type: String,
      required: true,
      trim: true,
    },
    "Link de acceso": {
      type: String,
      required: true,
      trim: true,
    },
    "Área": {
      type: String,
      required: true,
      trim: true,
    },
    Campo: {
      type: String,
      required: true,
      trim: true,
    },
    Disciplina: {
      type: String,
      required: true,
      trim: true,
    },
    "Temática": {
      type: String,
      required: true,
      trim: true,
    },
    "Municipios de estudio": {
      type: String,
      required: true,
      trim: true,
    },
    "Palabras Clave": {
      type: Array,
      trim: true,
    },
    Disponibilidad: {
      type: String,
      required: true,
      trim: true,
    },
    "Número de páginas": {
      type: String,
      required: true,
      trim: true,
    },
    "Compilador/ Editor/ Coordinador/ Libro": {
      type: String,
      required: true,
      trim: true,
    },
    "Clasificación": {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timesStampes: true,
  }
);

export default mongoose.model("Documents", documentSchema);
