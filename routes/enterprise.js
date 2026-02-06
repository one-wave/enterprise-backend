const express = require("express");
const router = express.Router();
const enterpriseController = require("../controller/EnterpriseController");

// GET /api/enterprise
router.get("/", enterpriseController.getTestService);

router.get("/company", enterpriseController.getEnterpriseCompanyService);

router.get("/company/region", enterpriseController.getResionCount);


module.exports = router;

