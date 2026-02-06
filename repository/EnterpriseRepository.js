
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

async function postEnterpriseJobsRegister() {
  //해당 기업에서 직무 추가하기
}


module.exports = {
  getAllFromTestDB,
  getAllFromCompanyDB,
  getAllFromRegion,
  postEnterpriseRegister,
  getAllsCompany,
  getIsExist,
  postEnterpriseJobsRegister,
};

