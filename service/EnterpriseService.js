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
  const isExistCompany = await enterpriseRepository.getIsExist(body);
  if (isExistCompany) {
    return false;
  } else {
    await enterpriseRepository.postEnterpriseRegister();
    return true;
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