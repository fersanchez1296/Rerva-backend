import express from "express";
import morgan from "morgan";
import documentsRoutes from "./routes/documents.routes.js";
import countriesRoutes from './routes/countries.routes.js'
import cors from "cors"
const app = express();
app.use(morgan("dev"));
app.use(cors())
app.use("/api",documentsRoutes)
app.use("/api",countriesRoutes)

export default app
