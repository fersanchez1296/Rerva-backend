import { Router } from "express";
import {
  busqueda_paises,
  busqueda_municipios,
  busqueda_general,
  busqueda_autores,
  secciones_busqueda,
  busqueda_areas,
  busqueda_revistas,
  busqueda_documentos_revistas,
  graficos_municipios,
  graficos_paises

} from "../controllers/documents.controller.js";

const router = Router();
router.get("/secciones-busqueda", secciones_busqueda);
router.get("/graficos/municipios", graficos_municipios);
router.get("/graficos/paises", graficos_paises);
router.get("/busqueda/general", busqueda_general);
router.get("/busqueda/municipio", busqueda_municipios);
router.get("/busqueda/autor", busqueda_autores);
router.get("/busqueda/area-de-conocimiento", busqueda_areas);
router.get("/busqueda/revista", busqueda_revistas);
router.get("/busqueda/documentos-revista", busqueda_documentos_revistas);
router.get("/busqueda/pais-de-publicacion", busqueda_paises);


export default router;
