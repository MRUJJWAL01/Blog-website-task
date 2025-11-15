const express = require("express");
const upload = require("../utils/mutler");
const { authenticate } = require("../middlewares/auth.middleware");
const { userDpController } = require("../controllers/user.controller");

const router = express.Router();

router.post("/profile-picture",authenticate,upload.single("images"),userDpController);

module.exports = router;