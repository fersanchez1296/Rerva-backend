import { Router } from "express";
import { getCountries,getCountriesData } from "../controllers/countries.controller.js";

const router = Router();

router.get("/countries", getCountries);
router.get("/countriesData", getCountriesData);

export default router;
