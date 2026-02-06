const enterpriseRepository = require("../repository/EnterpriseRepository");

async function getEnterpriseServiceData() {
  const rows = await enterpriseRepository.getAllFromTestDB();
  return rows;
}

async function getEnterpriseCompanyService() {
  const rows = await enterpriseRepository.getAllFromCompanyDB();
  return rows;
}

async function getResionCount() {
  const rows = await enterpriseRepository.getAllFromRegion();
  return rows;
}

async function postEnterpriseRegister(body) {
  // 필수값 체크 (없으면 실패)
  if (!body?.companyName) return false;

  const isExistCompany = await enterpriseRepository.getIsExist(body);
  if (isExistCompany) {
    return false;
  } else {
    const ok = await enterpriseRepository.postEnterpriseRegister(body);
    return !!ok;
  }
}

async function getAllsCompany() {
  const rows = await enterpriseRepository.getAllsCompany();
  return rows;
}

module.exports = {
  getEnterpriseServiceData,
  getEnterpriseCompanyService,
  getResionCount,
  postEnterpriseRegister,
  getAllsCompany
};