import mongoose from "mongoose";

const solicitudesSchema = mongoose.Schema(
  {
    Autor: {
      type: String,
      trim: true,
    },
    "Título": {
      type: String,
      trim: true,
    },
    Email: {
      type: String,
      trim: true,
    },
    Link: {
      type: String,
      required: true,
      trim: true,
    },
    ApprovalStatus: {
      type: String,
      required: true,
      trim: true,
    },
    DocumentStatus: {
      type: String,
      required: true,
      trim: true,
    },
    CreatedAt: {
      type: Date,
      required: true,
      trim: true,
    },
    EndedAt: {
      type: Date,
      required: true,
      trim: true,
      default: function() {
        return new Date("2000-01-01T06:00:00.000+00:00");
      }
    },
    Notas: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timesStampes: true,
  }
);

export default mongoose.model("Solicitudes", solicitudesSchema);
