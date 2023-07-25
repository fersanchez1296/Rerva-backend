import mongoose from "mongoose";

const documentSchema = mongoose.Schema(
  {
    "base de datos": {
      type: String,
      required: true,
      trim: true,
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      trim: true,
    },
    autoria: {
      type: String,
      required: true,
      trim: true,
    },
    "autor principal": {
      type: String,
      required: true,
      trim: true,
    },
    coautor: {
      type: Array,
      trim: true,
    },
    "tipo de documento": {
      type: String,
      required: true,
      trim: true,
    },
    "nombre de la revista o libro": {
      type: String,
      required: true,
      trim: true,
    },
    "pais de la publicación": {
      type: String,
      trim: true,
    },
    "libros-editorial": {
      type: String,
      trim: true,
    },
    "tesis-institución": {
      type: String,
      required: true,
      trim: true,
    },
    "tipo de consulta": {
      type: String,
      required: true,
      trim: true,
    },
    "link ": {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    campo: {
      type: String,
      required: true,
      trim: true,
    },
    disciplina: {
      type: String,
      required: true,
      trim: true,
    },
    tema: {
      type: String,
      required: true,
      trim: true,
    },
    metodologia: {
      type: String,
      trim: true,
    },
    escala: {
      type: String,
      required: true,
      trim: true,
    },
    observaciones: {
      type: String,
      required: true,
      trim: true,
    },
    "territorio analizado": {
      type: String,
      required: true,
      trim: true,
    },
    region: {
      type: String,
      required: true,
      trim: true,
    },
    "palabras clave": {
      type: Array,
      trim: true,
    },
    disponibilidad: {
      type: String,
      required: true,
      trim: true,
    },
    paginas: {
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
