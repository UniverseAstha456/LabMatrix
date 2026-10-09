const router = require("express").Router();

// Authentication routes
router.use("/auth", require("./auth.routes"));

module.exports = router;