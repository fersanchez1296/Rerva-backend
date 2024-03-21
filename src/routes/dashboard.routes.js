import { Router } from "express";
import { getDocuments,getHistorial,getBusqueda } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/getDocumentsDashboard", getDocuments);
router.get("/getHistorial", getHistorial);
router.post("/busquedas", getBusqueda);

export default router;
