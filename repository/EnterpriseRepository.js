
const { pool } = require("../config/db");

async function getAllFromTestDB() {
  const { rows } = await pool.query('SELECT * FROM "testDB";');
  return rows;
}

async function getIsExist(body) {
  const companyName = body.companyName;

  if (!companyName) return false; // 값 없으면 바로 false

  const { rows } = await pool.query(
      `SELECT EXISTS (
        SELECT 1 FROM "company"
        WHERE TRIM("company_name") = TRIM($1)
     ) AS "exists"`,
      [companyName]
  );

  return rows[0].exists; // true / false
}


async function getAllFromCompanyDB() {
  const { rows } = await pool.query('SELECT * FROM "job_post"');
  return rows;
}

async function getAllsCompany() {
  const { rows } = await pool.query('SELECT * FROM "company"');
  return rows;
}

async function getAllFromRegion() {
  const { rows } = await pool.query('SELECT * FROM "region_job_count"');
  return rows;
}

async function postEnterpriseRegister(body) {
  // 기업 등록 (company_name, company_phone)
  const companyName = body?.companyName;
  const companyPhone = body?.companyPhone ?? null;

  if (!companyName) return null;

  try {
    const result = await pool.query(
      'INSERT INTO company (company_name, company_phone) VALUES ($1, $2) RETURNING company_id',
      [companyName, companyPhone]
    );

    if (result.rowCount !== 1) return null;

    // 생성된 UUID 반환
    return result.rows[0].company_id;
  } catch (e) {
    // 중복/제약조건/DB에러 등은 실패로 처리
    return null;
  }
}

// 회사 공고 생성
async function createJobPost(data) {
  const {
    company_id,
    job_nm,
    job_location,
    emp_type,
    enter_type,
    salary,
    salary_type,
    req_career,
    req_educ,
    regagn_name,
    env_both_hands,
    env_eye_sight,
    env_hand_work,
    env_lift_power,
    env_lstn_talk,
    env_stnd_walk,
    offer_end_dt,
    reg_dt,
    term_date,
    job_email_contact,
  } = data;

  if (!company_id || !job_nm) return null;

  // salary를 숫자로 변환 (문자열이면 숫자로, 없으면 0)
  let salaryNum = 0;
  if (salary !== null && salary !== undefined && salary !== "") {
    if (typeof salary === "string") {
      salaryNum = parseInt(salary.replace(/,/g, ""), 10) || 0;
    } else {
      salaryNum = Number(salary) || 0;
    }
  }

  // offer_end_dt 처리 (bigint, YYYYMMDD 형식)
  // 없으면 기본값으로 30일 후 날짜 사용
  let offerEndDtInt = null;
  if (offer_end_dt) {
    // 문자열이면 YYYY-MM-DD 형식을 YYYYMMDD로 변환
    if (typeof offer_end_dt === "string") {
      offerEndDtInt = parseInt(offer_end_dt.replace(/-/g, ""), 10) || null;
    } else {
      offerEndDtInt = parseInt(offer_end_dt, 10) || null;
    }
  }
  
  // offer_end_dt가 없으면 30일 후 날짜를 기본값으로 설정
  if (!offerEndDtInt) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, "0");
    const day = String(futureDate.getDate()).padStart(2, "0");
    offerEndDtInt = parseInt(`${year}${month}${day}`, 10);
  }

  // reg_dt 처리 (bigint, YYYYMMDD 형식, NOT NULL)
  let regDtInt = null;
  if (reg_dt) {
    if (typeof reg_dt === "string") {
      regDtInt = parseInt(reg_dt.replace(/-/g, ""), 10) || null;
    } else {
      regDtInt = parseInt(reg_dt, 10) || null;
    }
  }
  // reg_dt가 없으면 오늘 날짜를 기본값으로 설정
  if (!regDtInt) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    regDtInt = parseInt(`${year}${month}${day}`, 10);
  }

  // term_date 처리 (date 타입, NOT NULL)
  let termDateValue = null;
  if (term_date) {
    // 문자열이면 Date 객체로 변환
    if (typeof term_date === "string") {
      termDateValue = term_date.includes("T") ? term_date.split("T")[0] : term_date;
    } else {
      termDateValue = term_date;
    }
  }
  // term_date가 없으면 오늘 날짜를 기본값으로 설정 (YYYY-MM-DD 형식)
  if (!termDateValue) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    termDateValue = `${year}-${month}-${day}`;
  }

  const query = `
    INSERT INTO job_post (
      company_id, job_email_contact, job_location, emp_type, enter_type,
      env_both_hands, env_eye_sight, env_hand_work, env_lift_power,
      env_lstn_talk, env_stnd_walk, job_nm,
      offer_end_dt, reg_dt, regagn_name,
      req_career, req_educ, salary, salary_type, term_date
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9,
      $10, $11, $12,
      $13, $14, $15,
      $16, $17, $18, $19, $20
    )
    RETURNING job_post_id
  `;

  const values = [
    company_id,
    job_email_contact || null,
    job_location || "정보없음", // NOT NULL
    emp_type || "정보없음", // NOT NULL
    enter_type || "정보없음", // NOT NULL
    env_both_hands || "정보없음", // NOT NULL
    env_eye_sight || "정보없음", // NOT NULL
    env_hand_work || "정보없음", // NOT NULL
    env_lift_power || "정보없음", // NOT NULL
    env_lstn_talk || "정보없음", // NOT NULL
    env_stnd_walk || "정보없음", // NOT NULL
    job_nm,
    offerEndDtInt,
    regDtInt, // NOT NULL
    regagn_name || "정보없음", // NOT NULL
    req_career || "정보없음", // NOT NULL
    req_educ || "정보없음", // NOT NULL
    salaryNum, // NOT NULL (이미 0으로 기본값 설정됨)
    salary_type || "정보없음", // NOT NULL
    termDateValue, // NOT NULL
  ];

  try {
    const result = await pool.query(query, values);
    if (result.rowCount !== 1) {
      console.error("[createJobPost] INSERT 실패: rowCount =", result.rowCount);
      return null;
    }
    return result.rows[0].job_post_id;
  } catch (e) {
    console.error("[createJobPost] DB 에러:", e.message);
    console.error("[createJobPost] 에러 상세:", e);
    console.error("[createJobPost] 쿼리:", query);
    console.error("[createJobPost] 값:", values);
    // 에러를 throw해서 상위로 전달
    throw new Error(`공고 생성 실패: ${e.message}`);
  }
}

// 회사 공고 수정 (job_post_id + company_id 기반)
async function updateJobPost(data) {
  const {
    job_post_id,
    company_id,
    job_nm,
    job_location,
    emp_type,
    enter_type,
    salary,
    salary_type,
    req_career,
    req_educ,
    regagn_name,
    env_both_hands,
    env_eye_sight,
    env_hand_work,
    env_lift_power,
    env_lstn_talk,
    env_stnd_walk,
  } = data;

  if (!job_post_id || !company_id) return false;

  // salary를 숫자로 변환 (문자열이면 숫자로, 없으면 0)
  let salaryNum = 0;
  if (salary !== null && salary !== undefined && salary !== "") {
    if (typeof salary === "string") {
      salaryNum = parseInt(salary.replace(/,/g, ""), 10) || 0;
    } else {
      salaryNum = Number(salary) || 0;
    }
  }

  const query = `
    UPDATE job_post
    SET
      job_nm = $3,
      job_location = $4,
      emp_type = $5,
      enter_type = $6,
      salary = $7,
      salary_type = $8,
      req_career = $9,
      req_educ = $10,
      regagn_name = $11,
      env_both_hands = $12,
      env_eye_sight = $13,
      env_hand_work = $14,
      env_lift_power = $15,
      env_lstn_talk = $16,
      env_stnd_walk = $17
    WHERE job_post_id = $1
      AND company_id = $2
  `;

  const values = [
    job_post_id,
    company_id,
    job_nm || null,
    job_location || null,
    emp_type || null,
    enter_type || null,
    salaryNum,
    salary_type || null,
    req_career || null,
    req_educ || null,
    regagn_name || null,
    env_both_hands || null,
    env_eye_sight || null,
    env_hand_work || null,
    env_lift_power || null,
    env_lstn_talk || null,
    env_stnd_walk || null,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rowCount === 1;
  } catch (e) {
    console.error("[updateJobPost] DB 에러:", e.message);
    console.error("[updateJobPost] 쿼리:", query);
    console.error("[updateJobPost] 값:", values);
    return false;
  }
}


// 특정 공고에 지원한 지원자 목록 조회
async function getJobPostApplications(jobPostId) {
  if (!jobPostId) return [];

  const query = `
    SELECT 
      jpa.application_id,
      jpa.job_post_id,
      jpa.user_id,
      jpa.resume_snapshot,
      jpa.applied_at,
      jpa.status,
      au.first_name,
      au.last_name,
      au.user_email_contact,
      aui.env_both_hands,
      aui.env_eye_sight,
      aui.env_hand_work,
      aui.env_lift_power,
      aui.env_lstn_talk,
      aui.env_stnd_walk,
      aui.user_phone,
      aui.birth_date
    FROM job_post_application jpa
    INNER JOIN applicant_user au ON jpa.user_id = au.user_id
    LEFT JOIN applicant_user_info aui ON jpa.user_id = aui.user_id
    WHERE jpa.job_post_id = $1
    ORDER BY jpa.applied_at DESC
  `;

  try {
    const { rows } = await pool.query(query, [jobPostId]);
    return rows;
  } catch (e) {
    console.error("[getJobPostApplications] DB 에러:", e.message);
    console.error("[getJobPostApplications] 쿼리:", query);
    throw new Error(`지원자 목록 조회 실패: ${e.message}`);
  }
}

module.exports = {
  getAllFromTestDB,
  getAllFromCompanyDB,
  getAllFromRegion,
  postEnterpriseRegister,
  getAllsCompany,
  getIsExist,
  createJobPost,
  updateJobPost,
  getJobPostApplications,
};

