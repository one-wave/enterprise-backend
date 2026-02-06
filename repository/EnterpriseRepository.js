
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

async function postEnterpriseRegister() {
  //회원가입시 기업 없으면 추가
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
  getIsExist
};

