const { getUniqueCompAddrs } = require("../service/jobImportService");

(async () => {
  try {
    const addrs = await getUniqueCompAddrs();
    console.log(`고유 compAddr 개수: ${addrs.length}`);
    console.log("예시 10개:");
    addrs.slice(0, 10).forEach((a, i) => {
      console.log(`${i + 1}. ${a}`);
    });
    process.exit(0);
  } catch (err) {
    console.error("compAddr 추출 실패:", err);
    process.exit(1);
  }
})();

