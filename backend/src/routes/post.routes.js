const express = require("express");
const { body, param, query } = require("express-validator");
const postCtrl = require("../controllers/post.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { ensureOwner } = require("../middlewares/owner.middleware");
const upload = require("../utils/mutler");

const router = express.Router();

/**
 * GET /api/posts
 * optional: ?search=&page=&limit=
 */
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1 }).toInt(),
    query("search").optional().trim().isString(),
  ],
  postCtrl.listPosts
);

/**
 * GET /api/posts/:id  (id can be ObjectId or slug)
 */
router.get("/:id", postCtrl.getPost);

/**
 * POST /api/posts  (auth required)
 */
router.post(
  "/create",
  authenticate,
  [
    body("title")
      .trim()
      .isLength({ min: 5, max: 120 })
      .withMessage("title 5-120 chars"),
    body("content").isLength({ min: 50 }).withMessage("content min 50 chars"),
  ],upload.array("images",5),
  postCtrl.createPost
);

/**
 * PUT /api/posts/:id  (auth + owner)
 */
router.put(
  "/:id",
  authenticate,
  ensureOwner,
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 5, max: 120 })
      .withMessage("title 5-120 chars"),
    body("content")
      .optional()
      .isLength({ min: 10 })
      .withMessage("content min 50 chars"),
  ],
  postCtrl.updatePost
);

/**
 * DELETE /api/posts/:id  (auth + owner)
 */
router.delete("/:id", authenticate, ensureOwner, postCtrl.deletePost);

module.exports = router;
