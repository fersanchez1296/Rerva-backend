import mongoose from "mongoose";

const usuarioSchema = mongoose.Schema(
    {
      user: {
        type: String,
        trim: true,
      },
      password: {
        type: String,
        trim: true,
      },
      nombre: {
        type: String,
        trim: true,
      },
    },
    {
      timesStampes: true,
    }
  );
  
  export default mongoose.model("Usuarios", usuarioSchema);