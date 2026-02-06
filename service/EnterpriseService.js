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
  if (!body?.companyName) {
    return { success: false, companyId: null };
  }

  const isExistCompany = await enterpriseRepository.getIsExist(body);
  if (isExistCompany) {
    return { success: false, companyId: null };
  } else {
    const companyId = await enterpriseRepository.postEnterpriseRegister(body);
    return {
      success: !!companyId,
      companyId: companyId ?? null,
    };
  }
}

async function createCompanyJob(body) {
  const jobPostId = await enterpriseRepository.createJobPost(body);
  return {
    success: !!jobPostId,
    jobPostId: jobPostId ?? null,
  };
}

async function updateCompanyJob(body) {
  const ok = await enterpriseRepository.updateJobPost(body);
  return {
    success: !!ok,
  };
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
  createCompanyJob,
  updateCompanyJob,
  getAllsCompany,
};