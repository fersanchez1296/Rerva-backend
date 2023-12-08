import express from "express";
import morgan from "morgan";
import documentsRoutes from "./routes/documents.routes.js";
import countriesRoutes from './routes/countries.routes.js'
import cors from "cors"
import 'dotenv/config'
const app = express();
app.use(express.urlencoded({ extended: false, decode: (str) => decodeURIComponent(str) }));
const URL_CONNNECT = process.env.URL_CONNNECT
export const PORT = process.env.PORT
app.use(morgan("dev"));
app.use(cors({
  origin: 'http://localhost:3000',  // Reemplaza con la URL de tu frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));
app.use("/api",documentsRoutes)
app.use("/api",countriesRoutes)

export default app
