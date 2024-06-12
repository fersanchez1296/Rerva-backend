import { Router } from "express";
import {
  getSolicitudes,
  aceptarSolicitud,
  rechazarSolicitud,
  postSolicitud,
  deleteSolicitud,
} from "../controllers/solicitudes.controller.js";

const router = Router();

router.get("/solicitudes", getSolicitudes);
router.put("/solicitud/aceptar/:id", aceptarSolicitud);
router.put("/solicitud/rechazar/:id", rechazarSolicitud);
router.post("/solicitud/", postSolicitud);
router.delete("/solicitud/:id", deleteSolicitud);

export default router;
