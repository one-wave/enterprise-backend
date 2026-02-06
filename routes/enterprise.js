const express = require("express");
const router = express.Router();
const enterpriseController = require("../controller/EnterpriseController");

// GET /api/enterprise
router.get("/", enterpriseController.getTestService);

router.get("/company", enterpriseController.getAllsCompany);

router.get("/company/job", enterpriseController.getEnterpriseCompanyService);

router.get("/company/region", enterpriseController.getResionCount);

router.post("/company/register", enterpriseController.postEnterpriseRegister);

// 회사 공고 생성
router.post("/company/job/register", enterpriseController.postEnterpriseJobsRegister);

// 회사 공고 수정 (UUID 기반)
router.put("/company/job/:jobPostId", enterpriseController.putEnterpriseJob);

// 특정 공고의 지원자 목록 조회
router.get("/company/job/:jobPostId/applications", enterpriseController.getJobPostApplications);

// 지원자 상태 업데이트
router.patch("/company/application/:applicationId/status", enterpriseController.patchApplicationStatus);

module.exports = router;

