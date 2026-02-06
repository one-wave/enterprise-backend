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