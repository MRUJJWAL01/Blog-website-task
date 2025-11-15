const postModel = require("../models/post.model");

const ensureOwner = async (req, res, next) => {
  try {
    const idOrSlug = req.params.id;
    let post;

    if (/^[0-9a-fA-F]{24}$/.test(idOrSlug)) {
      post = await postModel.findById(idOrSlug);
    }
    if (!post) {
      post = await postModel.findOne({ slug: idOrSlug });
    }

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.ownerId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: you are not the owner" });
    }

    req.post = post;
    next();
  } catch (err) {
    console.error("ensureOwner err", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { ensureOwner };
