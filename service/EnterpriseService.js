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

module.exports = {
  getEnterpriseServiceData,
  getEnterpriseCompanyService,
  getResionCount
};