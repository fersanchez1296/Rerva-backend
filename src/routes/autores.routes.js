import { Router } from "express";
import {
getAutores
} from "../controllers/autores.controller.js";

const router = Router();

router.get("/get-Autores", getAutores);

export default router;
