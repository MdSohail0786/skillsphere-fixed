const express = require("express");
const router = express.Router();
const passport = require("passport");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const {
  signup,
  verifyEmail,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  googleCallback,
} = require("../controllers/authController");

const signupRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 }),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("role").optional().isIn(["freelancer", "client"]),
];

router.post("/signup", validate(signupRules), signup);
router.post("/verify-email", body("token").notEmpty(), verifyEmail);
router.post(
  "/login",
  validate([body("email").isEmail(), body("password").notEmpty()]),
  login,
);
router.post("/refresh", refreshToken);
router.post("/logout", authenticate, logout);
router.post(
  "/forgot-password",
  validate([body("email").isEmail()]),
  forgotPassword,
);
router.post(
  "/reset-password",
  validate([body("token").notEmpty(), body("password").isLength({ min: 8 })]),
  resetPassword,
);
router.get("/me", authenticate, getMe);

// Google OAuth - only if configured
if (process.env.GOOGLE_CLIENT_ID) {
  router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    }),
  );
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    }),
    googleCallback,
  );
}
module.exports = router;
