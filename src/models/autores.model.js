import mongoose from "mongoose";

const autoresSchema = mongoose.Schema(
    {
      Autor: {
        type: Array,
        trim: true,
      },
      ADS: {
        type: Array,
        trim: true,
      },
      "País": {
        type: String,
        trim: true,
      },
      INST: {
        type: String,
        required: true,
        trim: true,
      },
      CLASS: {
        type: String,
        required: true,
        trim: true,
      },
      "Género": {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      timesStampes: true,
    }
  );
  
  export default mongoose.model("Autores", autoresSchema);