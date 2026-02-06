const enterpriseService = require("../service/EnterpriseService");

exports.getTestService = async (req, res, next) => {
    try {
        const rows = await enterpriseService.getEnterpriseServiceData();

        res.json({
            data: rows
        });

    } catch (err) {
        next(err);
    }
};

exports.getAllsCompany = async (req, res, next) => {
    try {
        const rows = await enterpriseService.getAllsCompany();
        res.json({
            data: rows
        })
    } catch (err) {
        next(err);
    }
}

exports.getEnterpriseCompanyService = async (req, res, next) => {
    try {
        const rows = await enterpriseService.getEnterpriseCompanyService();
        res.json({
            data: rows
        })
    } catch (err) {
        next(err);
    }
}

exports.getResionCount = async (req, res, next) => {
    try {
        const rows = await enterpriseService.getResionCount();
        res.json({
            data: rows
        })
    } catch (err) {
        next(err);
    }
}

exports.postEnterpriseRegister = async (req, res, next) => {
    try {
        const { success, companyId } = await enterpriseService.postEnterpriseRegister(req.body);

        return res.status(201).json({
            success,
            companyId,
        })
    } catch (e) {
        next(e);
    }
}

exports.postEnterpriseJobsRegister = async (req, res, next) => {
    try {
        console.log("[postEnterpriseJobsRegister] 요청 받음:", JSON.stringify(req.body, null, 2));

        const { success, jobPostId, error } = await enterpriseService.createCompanyJob(req.body);

        if (!success) {
            console.error("[postEnterpriseJobsRegister] 실패:", error);
            return res.status(400).json({
                success: false,
                message: error || "공고 생성에 실패했습니다. 입력값을 확인해주세요.",
            });
        }

        return res.status(201).json({
            success: true,
            jobPostId,
        });
    } catch (e) {
        console.error("[postEnterpriseJobsRegister] 예외 발생:", e);
        return res.status(500).json({
            success: false,
            message: e.message || "서버 오류가 발생했습니다.",
        });
    }
}

exports.putEnterpriseJob = async (req, res, next) => {
    try {
        const jobPostId = req.params.jobPostId;
        
        if (!jobPostId) {
            return res.status(400).json({
                success: false,
                message: "jobPostId가 필요합니다.",
            });
        }
        if (!req.body.company_id) {
            return res.status(400).json({
                success: false,
                message: "company_id가 필요합니다.",
            });
        }

        const body = { ...req.body, job_post_id: jobPostId };
        const { success } = await enterpriseService.updateCompanyJob(body);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: "공고 수정에 실패했습니다. 입력값을 확인해주세요.",
            });
        }

        return res.status(200).json({
            success: true,
        });
    } catch (e) {
        console.error("[putEnterpriseJob] 에러:", e);
        next(e);
    }
}

exports.getJobPostApplications = async (req, res, next) => {
    try {
        const jobPostId = req.params.jobPostId;
        
        if (!jobPostId) {
            return res.status(400).json({
                success: false,
                message: "jobPostId가 필요합니다.",
                data: [],
            });
        }

        const { success, applications, error } = await enterpriseService.getJobPostApplications(jobPostId);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: error || "지원자 목록 조회에 실패했습니다.",
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            data: applications,
        });
    } catch (e) {
        console.error("[getJobPostApplications] 예외 발생:", e);
        return res.status(500).json({
            success: false,
            message: e.message || "서버 오류가 발생했습니다.",
            data: [],
        });
    }
}