const express = require("express");
const PrintRequestController = require("../controllers/print_request");
const auth = require("../middlewares/auth");
const Role = require("../utils/userTypes");
const uploadDocument = require("../middlewares/uploadDocument");
const validation = require("../middlewares/printRequestValidator");

const router = express.Router();

router
  .route("/print_request")
  .get(auth.authCheck, PrintRequestController.listPrintRequests)
  .post(
    auth.authCheck,
    uploadDocument,
    validation.parsePR,
    validation.createPrintRequest,
    PrintRequestController.createPrintRequest
  );

router
  .route("/delete_print_request")
  .post(
    auth.authCheck,
    auth.authAllowTypes([Role.Admin, Role.SuperAdmin]),
    PrintRequestController.deletePrintRequest
  );

router
  .route("/print_request/:request_id")
  .patch(
    auth.authCheck,
    auth.authAllowTypes([Role.Admin, Role.SuperAdmin]),
    PrintRequestController.updateStatusPrintRequests
  );

router
  .route("/print_employees")
  .patch(
    auth.authCheck,
    auth.authAllowTypes([Role.Admin, Role.SuperAdmin]),
    PrintRequestController.updateStatusPrintEmployees
  );

router
  .route("/generate_vcard_pdf/:employee_id")
  .get(auth.authCheck, PrintRequestController.generateVCardPDF);

module.exports = router;
