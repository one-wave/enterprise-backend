
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
  } = data;

  if (!company_id || !job_nm) return null;

  const query = `
    INSERT INTO job_post (
      company_id, job_location, emp_type, enter_type,
      env_both_hands, env_eye_sight, env_hand_work, env_lift_power,
      env_lstn_talk, env_stnd_walk, job_nm,
      regagn_name, req_career, req_educ,
      salary, salary_type
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8,
      $9, $10, $11,
      $12, $13, $14,
      $15, $16
    )
    RETURNING job_post_id
  `;

  const values = [
    company_id,
    job_location ?? null,
    emp_type ?? null,
    enter_type ?? null,
    env_both_hands ?? null,
    env_eye_sight ?? null,
    env_hand_work ?? null,
    env_lift_power ?? null,
    env_lstn_talk ?? null,
    env_stnd_walk ?? null,
    job_nm,
    regagn_name ?? null,
    req_career ?? null,
    req_educ ?? null,
    salary ?? 0,
    salary_type ?? null,
  ];

  try {
    const result = await pool.query(query, values);
    if (result.rowCount !== 1) return null;
    return result.rows[0].job_post_id;
  } catch (e) {
    return null;
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
    job_nm ?? null,
    job_location ?? null,
    emp_type ?? null,
    enter_type ?? null,
    salary ?? 0,
    salary_type ?? null,
    req_career ?? null,
    req_educ ?? null,
    regagn_name ?? null,
    env_both_hands ?? null,
    env_eye_sight ?? null,
    env_hand_work ?? null,
    env_lift_power ?? null,
    env_lstn_talk ?? null,
    env_stnd_walk ?? null,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rowCount === 1;
  } catch (e) {
    return false;
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
};

