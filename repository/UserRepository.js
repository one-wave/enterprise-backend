
const { pool } = require("../config/db");

async function saveJwtToken({ userType, authCode, token, expiresAt }) {
  const query = `
    INSERT INTO jwt_tokens (user_type, auth_code, token, expires_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;

  const values = [userType, authCode, token, expiresAt];
  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  saveJwtToken,
};
