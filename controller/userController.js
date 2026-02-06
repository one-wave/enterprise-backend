const userService = require("../service/userService");

exports.loginUser = async (req, res, next) => {
    try {
        const { auth_code } = req.body || {};

        const result = await userService.loginCompanyByAuthCode(auth_code);

        if (!result.success) {
            return res.status(401).json({
                success: false,
                message: "인증코드가 유효하지 않습니다.",
            });
        }

        return res.status(200).json({
            success: true,
            token: result.token,
            expiresAt: result.expiresAt,
        });
    } catch (e) {
        next(e);
    }
}