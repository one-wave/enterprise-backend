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
        const val = await enterpriseService.postEnterpriseRegister(req.body);

        return res.status(201).json({
            success: val,
        })
    } catch (e) {
        next(e);
    }
}

exports.postEnterpriseJobsRegister = async (req, res, next) => {
    try {
        // 아직 구현되지 않은 API: 잘못된 라우팅으로 company/register가 호출되는 것 방지용
        return res.status(501).json({
            success: false,
            message: "Not implemented",
        });
    } catch (e) {
        next(e);
    }
}