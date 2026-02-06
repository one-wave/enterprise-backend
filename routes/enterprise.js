const express = require("express");
const router = express.Router();
const enterpriseController = require("../controller/EnterpriseController");

// GET /api/enterprise
router.get("/", enterpriseController.getTestService);

router.get("/company", enterpriseController.getAllsCompany);

router.get("/company/job", enterpriseController.getEnterpriseCompanyService);

router.get("/company/region", enterpriseController.getResionCount);

router.post("/company/register", enterpriseController.postEnterpriseRegister);

router.post("/company/job/register", enterpriseController.postEnterpriseJobsRegister);

module.exports = router;

