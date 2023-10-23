import { Router } from "express";
import {
  getDocuments,
  postDocument,
  getDocumentsForDecades,
  getDocumentsForArea,
  getDocumentsForDiscipline,
  getDocumentsForFieldStudy,
  getDocumentsForDocumentType,
  getDocumentsForEditorial,
  getDocumentsForPais,
  getDocumentsForAuthor,
} from "../controllers/documents.controller.js";

const router = Router();

router.get("/documents", getDocuments);
router.get("/Publicaciones-por-decadas", getDocumentsForDecades);
router.get("/Publicaciones-por-areas", getDocumentsForArea);
router.get("/Publicaciones-por-disciplina", getDocumentsForDiscipline);
router.get("/Publicaciones-por-campo-de-estudio", getDocumentsForFieldStudy);
router.get("/Publicaciones-por-tipo-de-documento", getDocumentsForDocumentType);
router.get("/Publicaciones-por-editorial", getDocumentsForEditorial);
router.get("/Publicaciones-por-pais", getDocumentsForPais);
router.get("/Publicaciones-por-autor", getDocumentsForAuthor);
router.post("/newDocument", postDocument);

export default router;
