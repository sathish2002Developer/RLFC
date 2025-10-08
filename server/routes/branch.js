const express = require('express');
const BranchesController = require('../controllers/branch');
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
const validation = require('../middlewares/companyBranchesValidator');

router
.route('/branches')
.get(authMiddleware.authCheck,BranchesController.getAllBranchWithCompany)
.post(authMiddleware.authCheck,validation.createCompanyBranchData, BranchesController.createBranch);
router
.route('/getallbranches')
.get(authMiddleware.authCheck,BranchesController.getAllBranch)

router
.route('/delete_branches').post(authMiddleware.authCheck,BranchesController.deleteBranchByCompanyBranchId)

router
.route('/branches/:branch_id')
.get(authMiddleware.authCheck,BranchesController.getBranchByBranchesIdWithCompany)
.put(validation.createCompanyBranchData, BranchesController.updateBranchByBranchId)
.delete(authMiddleware.authCheck,BranchesController.deleteBranchByCompanyBranchId);

module.exports = router;