import { Router } from "express";
import { getDocuments,postDocument, getDocumentsForDecades } from "../controllers/documents.controller.js";

const router = Router();

router.get("/documents",getDocuments)
router.get("/Publicaciones-por-decadas",getDocumentsForDecades)
router.post("/newDocument",postDocument)

export default router