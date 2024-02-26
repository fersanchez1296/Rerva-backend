import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import documentsRoutes from "./routes/documents.routes.js";
import countriesRoutes from "./routes/countries.routes.js";
import autoresRoutes from "./routes/autores.routes.js";
import solicitudesRoutes from "./routes/solicitudes.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import cors from "cors";
import "dotenv/config";
import { Server } from "socket.io";
import http from "http";

const app = express();
app.use(cors());
app.options("*", cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
    decode: (str) => decodeURIComponent(str),
  })
);
app.use(bodyParser.json());

const URL_CONNNECT = process.env.URL_CONNNECT;
export const PORT = process.env.PORT;
export const IoPORT = process.env.IoPORT;

app.use(morgan("dev"));
app.use(express.json());
app.use("/api", documentsRoutes);
app.use("/api", countriesRoutes);
app.use("/api", autoresRoutes);
app.use("/api", solicitudesRoutes);
app.use("/api", dashboardRoutes);

// Crear el servidor HTTP
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir solicitudes desde cualquier origen
    methods: ["GET", "POST"], // Permitir los métodos GET y POST
  },
});



server.listen(IoPORT, () => {
  console.log(`Servidor Socket.IO escuchando en el puerto ${IoPORT}`);
});
export { io };
export default app;
