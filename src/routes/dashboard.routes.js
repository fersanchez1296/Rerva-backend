import { Router } from "express";
import { getDocuments } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/getDocumentsDashboard", getDocuments);

export default router;
