import { Router } from "express";
import {
getSolicitudes,
updateSolicitud,
postSolicitud,
} from "../controllers/solicitudes.controller.js";

const router = Router();

router.get("/getSolicitudes", getSolicitudes);
router.put("/updateSolicitud/:id", updateSolicitud);
router.post("/postSolicitud/", postSolicitud);

export default router;
