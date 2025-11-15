const { validationResult } = require("express-validator");
const postModel = require("../models/post.model");
const uploadImage = require("../services/storage.services");
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!req.files) {
      return res.status(404).json({
        msg: "Image is required",
      });
    }
    let uploadedUrlArr = await Promise.all(
      req.files.map(
        async (element) =>
          await uploadImage(element.buffer, element.originalname)
      )
    );
    const username = req.user.username;
    const ownerId = req.user.userId;
    const post = new postModel({
      title,
      content,
      imageURL: uploadedUrlArr.map((elem) => elem.url),
      username,
      ownerId,
    });
    await post.save();
    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    console.error("createPost err", err);
    res.status(500).json({ message: "Server error" });
  }
};

const listPosts = async (req, res) => {
  try {
    const q = {};
    const search = req.query.search?.trim();
    if (search) {
      const re = new RegExp(search, "i");
      q.$or = [{ title: re }, { username: re }];
    }

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "10", 10), 1);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      postModel.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      postModel.countDocuments(q),
    ]);
    res.json({ items, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("listPosts err", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPost = async (req, res) => {
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

    res.json({ post });
  } catch (err) {
    console.error("getPost err", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(422)
        .json({ message: "Validation failed", details: errors.array() });

    const post = req.post;
    const { title, content } = req.body;
    if (!req.files) {
      return res.status(404).json({
        msg: "Image is required",
      });
    }
    let uploadedUrlArr = await Promise.all(
      req.files.map(
        async (element) =>
          await uploadImage(element.buffer, element.originalname)
      )
    );

    // if (title) post.title = title;
    // if (content) post.content = content;

    await postModel.findByIdAndUpdate(
      { _id: post._id },
      { title, content, imageURL: uploadedUrlArr.map((elem) => elem.url) }
    );

    res.json({ message: "Post updated", post });
  } catch (err) {
    console.error("updatePost err", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = req.post;

    await postModel.deleteOne({ _id: post._id });
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("deletePost err", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPost,
  listPosts,
  getPost,
  updatePost,
  deletePost,
};
