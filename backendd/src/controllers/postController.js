// src/controllers/postControllers.js
import { Post } from "../models/Post.js";
import sanitize from "mongo-sanitize";

// GET /api/posts
export const getPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = { user: req.user._id };
    if (req.query.status) query.status = req.query.status;
    if (req.query.platform) query.platforms = req.query.platform;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({ posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/posts/:id
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.user._id }).lean();
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { content, platforms, scheduledAt, imageUrl, status } = req.body;

    const sanitizedContent = sanitize(content);
    const sanitizedPlatforms = platforms.map((p) => sanitize(p));
    const sanitizedImageUrl = imageUrl ? sanitize(imageUrl) : "";


    // ✅ Validate content length
    if (!content || content.length > 500) {
      return res.status(400).json({ message: "Content is required and max 500 characters" });
    }

    // ✅ Validate platforms
    if (!platforms || !platforms.length) {
      return res.status(400).json({ message: "Select at least one platform" });
    }

    // ✅ Validate scheduled date (future only)
    if (scheduledAt && new Date(scheduledAt) < new Date()) {
      return res.status(400).json({ message: "Scheduled date must be in the future" });
    }
    const computedStatus =
      status || (scheduledAt && new Date(scheduledAt) > new Date() ? "scheduled" : "draft");

    const post = await Post.create({
      content,
      platforms,
      scheduledAt,
      imageUrl,
      status: computedStatus || "draft",
      user: req.user._id,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/posts/:id
export const updatePost = async (req, res) => {
  try {
    const { content, platforms, scheduledAt, imageUrl, status } = req.body;

    const post = await Post.findOne({ _id: req.params.id, user: req.user._id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    // ✅ Block editing of published posts
    if (post.status === "published") {
      return res.status(400).json({ message: "Cannot edit a published post" });
    }

    // ✅ Validate content length
    if (!content || content.length > 500) {
      return res.status(400).json({ message: "Content is required and max 500 characters" });
    }

    // ✅ Validate platforms
    if (!platforms || !platforms.length) {
      return res.status(400).json({ message: "Select at least one platform" });
    }

    // ✅ Validate scheduled date
    if (scheduledAt && new Date(scheduledAt) < new Date()) {
      return res.status(400).json({ message: "Scheduled date must be in the future" });
    }

    // Update fields
    post.content = sanitize(content);
    post.platforms = platforms.map((p) => sanitize(p));
    post.scheduledAt = scheduledAt;
    post.imageUrl = imageUrl;
    post.status = status || post.status;

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/posts/:id
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: err.message });
  }
};
