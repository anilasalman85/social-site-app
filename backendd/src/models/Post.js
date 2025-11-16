// src/models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, maxlength: 500 },
    platforms: [{ type: String, enum: ["Twitter", "Facebook", "Instagram"] }],
    scheduledAt: { type: Date, required: true, index: true },
    status: { type: String, enum: ["draft", "scheduled", "published", "failed"], default: "draft", index: true },
    imageUrl: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
   { timestamps: true }
);

postSchema.index({ user: 1, scheduledAt: 1 }); // index for performance

export const Post = mongoose.model("Post", postSchema);
