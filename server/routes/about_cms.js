const router = require("express").Router();
const ctrl = require("../controllers/about_cms");
const auth = require("../middlewares/auth");
const { handleMultipleImageUpload } = require("../middlewares/uploadMultipleImages");

// Aggregate
router.get("/", ctrl.getAll);

// Single upserts
router.put("/hero",  ctrl.saveHero);
router.put("/vision-mission",  ctrl.saveVisionMission);
router.put("/journey", ctrl.saveAboutJourney);
router.put("/journey/upload", handleMultipleImageUpload , ctrl.saveAboutJourneyWithImages);

// Sections
router.get("/sections", ctrl.sections.list);
router.post("/sections", auth.authCheck, ctrl.sections.create);
router.put("/sections/:id", auth.authCheck, ctrl.sections.update);
router.delete("/sections/:id", auth.authCheck, ctrl.sections.remove);

// Leadership
router.get("/leadership", ctrl.leadership.list);
router.post("/leadership", ctrl.leadership.create);
router.put("/leadership/:id",  ctrl.leadership.update);
router.delete("/leadership/:id", ctrl.leadership.remove);

// Values
router.get("/values", ctrl.values.list);
router.post("/values", auth.authCheck, ctrl.values.create);
router.put("/values/:id", auth.authCheck, ctrl.values.update);
router.delete("/values/:id", auth.authCheck, ctrl.values.remove);

// Journey
router.get("/journey", ctrl.journey.list);
router.post("/journey", auth.authCheck, ctrl.journey.create);
// router.put("/journey/:id", auth.authCheck, ctrl.journey.update);
router.delete("/journey/:id", auth.authCheck, ctrl.journey.remove);

module.exports = router;


