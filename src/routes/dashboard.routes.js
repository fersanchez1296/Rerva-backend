import { Router } from "express";
import { getDocuments,getHistorial } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/getDocumentsDashboard", getDocuments);
router.get("/getHistorial", getHistorial);

export default router;
