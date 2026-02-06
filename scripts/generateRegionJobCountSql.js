const fs = require("fs");
const path = require("path");

function escapeLiteral(str) {
  return str.replace(/'/g, "''");
}

(() => {
  const jsonPath = path.join(__dirname, "..", "compAddr.json");
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw);

  const lines = data.map((row) => {
    const city = escapeLiteral(row.region1);
    const district = escapeLiteral(row.region2);
    const count = row.count ?? 0;
    return `  ('${city}', '${district}', ${count})`;
  });

  const sql =
    "INSERT INTO public.region_job_count (city, district, count)\nVALUES\n" +
    lines.join(",\n") +
    ";\n";

  console.log(sql);
})();

