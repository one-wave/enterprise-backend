const { importJobsFromApi } = require("../service/jobImportService");

(async () => {
  try {
    const result = await importJobsFromApi();
    console.log(
      `Job import 완료: ${result.inserted}/${result.total}건 INSERT 됨`
    );
    process.exit(0);
  } catch (err) {
    console.error("Job import 실패:", err);
    process.exit(1);
  }
})();

