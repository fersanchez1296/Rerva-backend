import { Router } from "express";
import { getCountries,getCountriesData,getCountriesWithCount,getCountriesAndDecades } from "../controllers/countries.controller.js";

const router = Router();

router.get("/countries", getCountries);
router.get("/countriesData", getCountriesData);
router.get("/countriesDataCount", getCountriesWithCount);
router.get("/countriesAndDecades", getCountriesAndDecades);

export default router;