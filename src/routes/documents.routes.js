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
  getDocumentsForMunicipio,
  mapGetDocumentsForDecades,
  mapGetDocumentsForMunicipios,
  chartsGetDocumentsForMunicipios,
  chartsGetDocumentsForPais,
  mapGetDocumentsForPais,
  busquedaGeneral,
  busquedaAutores,
  infoBusquedaSecciones,
  busquedaArea,
  busquedaTipoDocumento,
  busquedaPais,
  busquedaRevista,

} from "../controllers/documents.controller.js";

const router = Router();

router.get("/documents", getDocuments);
router.get("/Publicaciones-por-decadas", getDocumentsForDecades);
router.get("/map/Publicaciones-por-decadas", mapGetDocumentsForDecades);
router.get("/map/Publicaciones-por-municipio", mapGetDocumentsForMunicipios);
router.get("/map/Publicaciones-por-pais", mapGetDocumentsForPais);
router.get("/charts/Publicaciones-por-municipio", chartsGetDocumentsForMunicipios);

router.get("/charts/Publicaciones-por-pais", chartsGetDocumentsForPais);
router.get("/Publicaciones-por-areas", getDocumentsForArea);
router.get("/Publicaciones-por-disciplina", getDocumentsForDiscipline);
router.get("/map/Publicaciones-por-disciplina", mapGetDocumentsForDecades);
router.get("/Publicaciones-por-campo-de-estudio", getDocumentsForFieldStudy);
router.get("/Publicaciones-por-tipo-de-documento", getDocumentsForDocumentType);
router.get("/Publicaciones-por-editorial", getDocumentsForEditorial);
router.get("/Publicaciones-por-pais", getDocumentsForPais);
router.get("/Publicaciones-por-municipio", getDocumentsForMunicipio);
router.get("/Publicaciones-por-autor", getDocumentsForAuthor);
router.post("/newDocument", postDocument);
// *********************************************
router.get("/busqueda/general", busquedaGeneral);
router.get("/busqueda/autor", busquedaAutores);
router.get("/busqueda/area-de-conocimiento", busquedaArea);
router.get("/busqueda/revista", busquedaRevista);
router.get("/busqueda/tipo-de-documento", busquedaTipoDocumento);
router.get("/busqueda/pais-de-publicacion", busquedaPais);
router.get("/busqueda/seccionesSelect", infoBusquedaSecciones);

export default router;
