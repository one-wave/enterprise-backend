var express = require("express");
var router = express.Router();

/* GET root - health check */
router.get("/", function (req, res, next) {

  res.json({ message: "API server running", path: "/" });
});

module.exports = router;
