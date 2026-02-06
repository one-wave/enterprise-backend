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
  try {
    // 필수 필드 검증
    if (!body?.company_id) {
      return {
        success: false,
        jobPostId: null,
        error: "company_id가 필요합니다.",
      };
    }
    if (!body?.job_nm) {
      return {
        success: false,
        jobPostId: null,
        error: "job_nm(공고 제목)이 필요합니다.",
      };
    }

    const jobPostId = await enterpriseRepository.createJobPost(body);
    return {
      success: !!jobPostId,
      jobPostId: jobPostId ?? null,
      error: jobPostId ? null : "공고 생성에 실패했습니다.",
    };
  } catch (e) {
    console.error("[createCompanyJob] 서비스 에러:", e.message);
    return {
      success: false,
      jobPostId: null,
      error: e.message || "공고 생성 중 오류가 발생했습니다.",
    };
  }
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

async function getJobPostApplications(jobPostId) {
  try {
    if (!jobPostId) {
      return {
        success: false,
        applications: [],
        error: "jobPostId가 필요합니다.",
      };
    }

    const applications = await enterpriseRepository.getJobPostApplications(jobPostId);
    return {
      success: true,
      applications,
    };
  } catch (e) {
    console.error("[getJobPostApplications] 서비스 에러:", e.message);
    return {
      success: false,
      applications: [],
      error: e.message || "지원자 목록 조회 중 오류가 발생했습니다.",
    };
  }
}

module.exports = {
  getEnterpriseServiceData,
  getEnterpriseCompanyService,
  getResionCount,
  postEnterpriseRegister,
  createCompanyJob,
  updateCompanyJob,
  getAllsCompany,
  getJobPostApplications,
};