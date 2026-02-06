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
        const { success, jobPostId } = await enterpriseService.createCompanyJob(req.body);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: "공고 생성에 실패했습니다.",
            });
        }

        return res.status(201).json({
            success: true,
            jobPostId,
        });
    } catch (e) {
        next(e);
    }
}

exports.putEnterpriseJob = async (req, res, next) => {
    try {
        const jobPostId = req.params.jobPostId;
        const body = { ...req.body, job_post_id: jobPostId };

        const { success } = await enterpriseService.updateCompanyJob(body);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: "공고 수정에 실패했습니다.",
            });
        }

        return res.status(200).json({
            success: true,
        });
    } catch (e) {
        next(e);
    }
}