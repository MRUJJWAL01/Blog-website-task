const express = require("express");
const { body } = require("express-validator");
const authCtrl = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware"); 

const router = express.Router();

router.post("/register",
  [
    body("username").trim().isLength({ min: 3, max: 30 }).withMessage("username must be 3-30 chars"),
    body("email").isEmail().withMessage("valid email required").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("password min 6 chars"),
  ],
  authCtrl.registerController
);

router.post(
  "/login",
  [
    body("emailOrUsername").notEmpty().withMessage("email or username required"),
    body("password").notEmpty().withMessage("password required"),
  ],authCtrl.loginController
);

router.get("/me", authenticate, authCtrl.getProfile);

router.put(
  "/me",
  authenticate,
  [
    body("username").optional().isLength({ min: 3, max: 30 }).withMessage("username 3-30 chars"),
    body("email").optional().isEmail().withMessage("valid email required").normalizeEmail(),
    body("password").optional().isLength({ min: 6 }).withMessage("password min 6 chars"),
  ],
  authCtrl.updateProfile
);
router.post("/logout", authCtrl.logoutController);

module.exports = router;
