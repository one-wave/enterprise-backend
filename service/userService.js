const jwt = require("jsonwebtoken");
const userRepository = require("../repository/UserRepository");

async function loginCompanyByAuthCode(authCode) {
  const trimmed = (authCode || "").trim();
  if (!trimmed) {
    return { success: false, token: null, expiresAt: null };
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET 이 .env에 설정되어 있지 않습니다.");
  }

  // 회사가 등록된 상태인지 확인 (없으면 로그인 실패)
  const isRegister = await userRepository.isRegister(trimmed);
  if (!isRegister) {
    return { success: false, token: null, expiresAt: null };
  }

  const payload = {
    type: "company",
    auth_code: trimmed,
  };

  // 1시간짜리 토큰 예시
  const expiresIn = "1h";
  const token = jwt.sign(payload, secret, { expiresIn });

  // 만료 시각 계산 (클라이언트에 내려주기용)
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1시간

  // DB에 토큰 저장
  await userRepository.saveJwtToken({
    userType: "company",
    authCode: trimmed,
    token,
    expiresAt,
  });

  return {
    success: true,
    token,
    expiresAt,
  };
}

module.exports = {
  loginCompanyByAuthCode,
};