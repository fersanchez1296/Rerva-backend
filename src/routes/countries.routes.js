import { Router } from "express";
import {
  getCountries,
  getCountriesData,
  getCountriesWithCount,
  getCountriesAndDecades,
  getCountriesAndAreas,
  getCountriesAndDisciplines,
  getCountriesAndFieldStudy,
  getCountriesAndDocumentType,
  getCountriesAndEditorial,
  getCountriesAndInstitution
} from "../controllers/countries.controller.js";

const router = Router();

router.get("/countries", getCountries);
router.get("/countriesData", getCountriesData);
router.get("/countriesDataCount", getCountriesWithCount);
router.get("/countriesAndDecades", getCountriesAndDecades);
router.get("/countriesAndAreas", getCountriesAndAreas);
router.get("/countriesAndDisciplines", getCountriesAndDisciplines);
router.get("/countriesAndFieldStudy", getCountriesAndFieldStudy);
router.get("/countriesAndDocumentType", getCountriesAndDocumentType);
router.get("/countriesAndEditorial", getCountriesAndEditorial);
router.get("/countriesAndInstitution", getCountriesAndInstitution);

export default router;
