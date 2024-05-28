import { Router } from "express";
import {
getSolicitudes,
updateSolicitud,
postSolicitud,
deleteSolicitud
} from "../controllers/solicitudes.controller.js";

const router = Router();

router.get("/getSolicitudes", getSolicitudes);
router.put("/updateSolicitud/:id", updateSolicitud);
router.post("/postSolicitud/", postSolicitud);
router.delete("/deleteSolicitud/:id", deleteSolicitud)

export default router;
