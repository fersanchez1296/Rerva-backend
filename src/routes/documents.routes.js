import { Router } from "express";
import { getDocuments,postDocument } from "../controllers/documents.controller.js";

const router = Router();

router.get("/documents",getDocuments)
router.post("/newDocument",postDocument)

export default router