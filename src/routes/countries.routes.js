import { Router } from "express";
import { getCountries,getCountriesData,getCountriesWithCount,getCountriesAndYears } from "../controllers/countries.controller.js";

const router = Router();

router.get("/countries", getCountries);
router.get("/countriesData", getCountriesData);
router.get("/countriesDataCount", getCountriesWithCount);
router.get("/countriesAndYears", getCountriesAndYears);

export default router;