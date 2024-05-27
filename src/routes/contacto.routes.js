import { Router } from "express";
import {
contacto
} from "../controllers/contacto.controller.js";

const router = Router();

router.post("/contacto", contacto);

export default router;
