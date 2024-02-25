import express from "express";
import bodyParser from 'body-parser';
import morgan from "morgan";
import documentsRoutes from "./routes/documents.routes.js";
import countriesRoutes from './routes/countries.routes.js';
import autoresRoutes from "./routes/autores.routes.js";
import solicitudesRoutes from "./routes/solicitudes.routes.js";
import cors from "cors"
import 'dotenv/config'

const app = express();
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false, decode: (str) => decodeURIComponent(str) }));
app.use(bodyParser.json());

const URL_CONNNECT = process.env.URL_CONNNECT
export const PORT = process.env.PORT

app.use(morgan("dev"));
app.use(express.json());
app.use("/api",documentsRoutes)
app.use("/api",countriesRoutes)
app.use("/api",autoresRoutes)
app.use("/api",solicitudesRoutes)

export default app
