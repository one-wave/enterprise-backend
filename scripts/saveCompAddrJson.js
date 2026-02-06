const fs = require("fs");
const path = require("path");
const { getCompAddrJson } = require("../service/jobImportService");

(async () => {
  try {
    const data = await getCompAddrJson();
    const targetPath = path.join(__dirname, "..", "compAddr.json");

    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), "utf-8");

    console.log(`compAddr.json 저장 완료: ${data.length}건`);
    console.log(`파일 위치: ${targetPath}`);
    console.log("예시 5건 (region1, region2, count):");
    data.slice(0, 5).forEach((item, idx) => {
      console.log(`${idx + 1}. ${item.region1} ${item.region2} - ${item.count}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("compAddr JSON 저장 실패:", err);
    process.exit(1);
  }
})();

