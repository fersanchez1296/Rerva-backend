import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import documentsRoutes from "./routes/documents.routes.js";
import autoresRoutes from "./routes/autores.routes.js";
import solicitudesRoutes from "./routes/solicitudes.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import contactoRoutes from "./routes/contacto.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import "dotenv/config";

const app = express();
<<<<<<< HEAD
app.use(
  cors({
    origin: [
      "http://148.202.89.67:3600",//repositorio
      "http://148.202.89.67:3500",//rama de desarrollo
      "http://148.202.89.67:3100",//dashboard
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);
=======
app.use(cors({
  origin: 'http://148.202.89.67:3600', // Cambia esto a la URL de tu frontend
  credentials: true,
}));
>>>>>>> 6bdabd3e584e8cec58a4c2fa83e1b990e246739e
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const URL_CONNNECT = process.env.URL_CONNNECT;
export const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());
app.use("/api", documentsRoutes);
app.use("/api", autoresRoutes);
app.use("/api", solicitudesRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", contactoRoutes);
app.use("/api", authRoutes);

export default app;
