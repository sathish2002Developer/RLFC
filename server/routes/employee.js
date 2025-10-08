const express = require("express");
const multer = require("multer");
const EmployeeController = require("../controllers/employee");
const auth = require("../middlewares/auth");
const uploadPhoto = require("../middlewares/uploadPhoto");
const userTypes = require("../utils/userTypes");
const validation = require("../middlewares/employeeValidator");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(
  "/pdf_data/employees/:employee_id",
  auth.validateAPI,
  EmployeeController.getEmployeeByEmployeeIdWithMappedData
);

router
  .route("/employees/active")
  .get(
    auth.validateAPI,
    auth.authType(userTypes.SuperAdmin),
    EmployeeController.getAllActiveEmployeesWithMappedData
  );

router
  .route("/employees/inactive")
  .get(
    auth.authCheck,
    EmployeeController.getAllInActiveEmployeesWithMappedData
  );

router
  .route("/employees/sync_qr_codes")
  .post(
    auth.validateAPI,
    auth.authType(userTypes.SuperAdmin),
    EmployeeController.syncQRCodeImages
  );

router
  .route("/import-employees")
  .post(
    auth.authCheck,
    upload.single("file"),
    EmployeeController.importEmployees
  );

router
  .route("/export-employees")
  .get(auth.authCheck, EmployeeController.exportEmployee);

router
  .route("/employees")
  .get(auth.authCheck, EmployeeController.listEmployees)
  .post(
    auth.authCheck,
    uploadPhoto,
    validation.createEmployeeData,
    EmployeeController.createEmployee
  );

// .get(EmployeeController.getAllEmployees);

// router
// .route("/employees/:id")
// .get(EmployeeController.getEmployeeById)
// .put(validation.updateEmployeeData,EmployeeController.updateEmployeeById)
// .delete(EmployeeController.deleteEmployeeById);

router
  .route("/employees/:employee_id")
  // .get(EmployeeController.getEmployeeByEmployeeId)
  .get(auth.authCheck, EmployeeController.getEmployeeByEmployeeIdWithMappedData)
  .put(
    auth.authCheck,
    uploadPhoto,
    validation.updateEmployeeData,
    EmployeeController.updateEmployeeByEmployeeId
  )
  .patch(auth.authCheck, EmployeeController.updateActiveEmployeeByEmployeeId);
// .delete(
//   auth.authCheck,
//   // auth.authAllowTypes([userTypes.Admin, userTypes.SuperAdmin]),
//   EmployeeController.deleteEmployeeByEmployeeId
// )

router
  .route("/delete_employees")
  .post(auth.authCheck, EmployeeController.deleteEmployeeByEmployeeId);
router
  .route("/delete_employee")
  .post(auth.authCheck, EmployeeController.deleteEmployeesById);

router
  .route("/vcard/:employee_id")
  .get(EmployeeController.getEmployeeByEmployeeIdWithMappedData);

router
  .route("/download-vcard/:employee_id")
  .get(EmployeeController.getVCardByEmployeeId);

router
  .route("/send_qr_emails")
  .post(auth.authCheck, EmployeeController.sendQREmail);

module.exports = router;
