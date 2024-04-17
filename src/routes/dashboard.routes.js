import { Router } from "express";
import {
  getDocuments,
  getHistorial,
  getBusqueda,
  dashboard_estadisticas,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/getDocumentsDashboard", getDocuments);
router.get("/getHistorial", getHistorial);
router.post("/busquedas", getBusqueda);
router.get("/dashboard/estadisticas", dashboard_estadisticas);

export default router;
