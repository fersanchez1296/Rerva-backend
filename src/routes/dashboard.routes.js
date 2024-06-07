import { Router } from "express";
import {
  getDocuments,
  getHistorial,
  getBusqueda,
  dashboard_estadisticas,
  updateDocument,
  postDocument,
  deleteDocument,
  getAuthors,
  getUsers,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/getDocumentsDashboard", getDocuments);
router.get("/autores", getAuthors);
router.get("/usuarios", getUsers);
router.post("document", postDocument);
router.put("/document/:id", updateDocument);
router.delete("/document/:id", deleteDocument);
router.get("/getHistorial", getHistorial);
router.post("/busquedas", getBusqueda);
router.get("/dashboard/estadisticas", dashboard_estadisticas);

export default router;
