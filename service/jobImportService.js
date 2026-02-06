const { pool } = require("../config/db");
const xml2js = require("xml2js");

// 고용공단 장애인 친화 일자리 환경 API
const JOB_API_URL =
  "https://apis.data.go.kr/B552583/job/job_list_env?serviceKey=772NadzOwQdcSNJo5UBeymwwEcqt6L66kYyNFFB0wPl6hZnqEEYQyJ9eBNB%2BzLQPS6DRbh9Lseedo8h1wxkpgw%3D%3D&pageNo=1&numOfRows=1000";

function parseTermDate(raw) {
  if (!raw) return { start: null, end: null };
  const parts = raw.split("~").map((s) => s.trim());
  return {
    start: parts[0] || null,
    end: parts[1] || null,
  };
}

async function fetchJobItems() {
  const res = await fetch(JOB_API_URL);
  if (!res.ok) {
    throw new Error(`Job API 요청 실패: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  const parsed = await xml2js.parseStringPromise(xml, {
    explicitArray: false,
    trim: true,
  });

  const items = parsed?.response?.body?.items?.item || [];
  return Array.isArray(items) ? items : [items];
}

async function importJobsFromApi() {
  const items = await fetchJobItems();

  const client = await pool.connect();
  let inserted = 0;

  try {
    await client.query("BEGIN");

    for (const item of items) {
      const companyName = item.busplaName || null; // 사업장명
      const companyPhone = item.cntctNo || null; // 연락처

      if (!companyName) {
        continue;
      }

      // company 저장
      const companyRes = await client.query(
        "INSERT INTO company (company_name, company_phone) VALUES ($1, $2) RETURNING company_id",
        [companyName, companyPhone]
      );

      const companyId = companyRes.rows[0].company_id;

      const termDateRaw = item.termDate || null; // 예: "2026-01-30~2026-02-06"
      const { start: termStartDt, end: offerEndDt } = parseTermDate(
        termDateRaw
      );

      const salaryRaw = item.salary || null; // 예: "1,183,000"
      const salary =
        salaryRaw && typeof salaryRaw === "string"
          ? salaryRaw.replace(/,/g, "")
          : salaryRaw || 0; // salary NOT NULL 이면 0 기본값

      // offer_end_dt 컬럼이 bigint(YYYYMMDD) 타입이라고 가정하고 변환
      const offerEndDtInt =
        offerEndDt && typeof offerEndDt === "string"
          ? parseInt(offerEndDt.replace(/-/g, ""), 10)
          : null;

      const envBothHands = item.envBothHands || "정보없음";
      const envEyesight = item.envEyesight || "정보없음";
      const envHandWork = item.envHandWork || "정보없음";
      const envLiftPower = item.envLiftPower || "정보없음";
      const envLstnTalk = item.envLstnTalk || "정보없음";
      const envStndWalk = item.envStndWalk || "정보없음";

      await client.query(
        `INSERT INTO job_post (
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
         )`,
        [
          companyId,
          null, // job_email_contact (API에 없음)
          item.compAddr || null,
          item.empType || null,
          item.enterType || null,
          envBothHands,
          envEyesight,
          envHandWork,
          envLiftPower,
          envLstnTalk,
          envStndWalk,
          item.jobNm || null,
          offerEndDtInt,
          item.regDt || null,
          item.regagnName || null,
          item.reqCareer || null,
          item.reqEduc || null,
          salary,
          item.salaryType || null,
          termStartDt || null,
        ]
      );

      inserted += 1;
    }

    await client.query("COMMIT");
    return { inserted, total: items.length };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// API에서 compAddr만 모아서 중복 제거 후 리스트로 반환
async function getUniqueCompAddrs() {
  const items = await fetchJobItems();
  const addrSet = new Set();

  for (const item of items) {
    const raw = item.compAddr;
    if (!raw) continue;
    const trimmed = raw.trim();
    if (!trimmed) continue;
    addrSet.add(trimmed);
  }

  return Array.from(addrSet);
}

// "광주광역시 서구 ..." -> { region1: "광주광역시", region2: "서구" }
function splitRegionFromAddr(addr) {
  if (!addr) {
    return { region1: null, region2: null };
  }
  const trimmed = addr.trim();
  const parts = trimmed.split(/\s+/);
  const region1 = parts[0] || null; // 시/도 (ex. 경기도, 광주광역시)
  const region2 = parts[1] || null; // 시/구/군 (ex. 성남시, 서구, 남구)
  return { region1, region2 };
}

// compAddr를 JSON 객체 배열로 변환 (region1, region2, count)
async function getCompAddrJson() {
  const items = await fetchJobItems();
  const map = new Map();

  for (const item of items) {
    const addr = item.compAddr;
    if (!addr) continue;
    const { region1, region2 } = splitRegionFromAddr(addr);
    if (!region1 || !region2) continue;
    const key = `${region1}|${region2}`;
    const current = map.get(key) || { region1, region2, count: 0 };
    current.count += 1;
    map.set(key, current);
  }

  return Array.from(map.values());
}

module.exports = {
  importJobsFromApi,
  getUniqueCompAddrs,
  splitRegionFromAddr,
  getCompAddrJson,
};


