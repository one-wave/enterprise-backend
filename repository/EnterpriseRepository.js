const { pool } = require("../config/db");

async function getAllFromTestDB() {
  const { rows } = await pool.query('SELECT * FROM "testDB";');
  return rows;
}

async function getAllFromCompanyDB() {
  const { rows } = await pool.query('SELECT * FROM "company"');
  return rows;
}

async function getAllFromRegion() {
  const { rows } = await pool.query('SELECT * FROM "region_job_count"');
  return rows;
}

module.exports = {
  getAllFromTestDB,
  getAllFromCompanyDB,
  getAllFromRegion,
};

