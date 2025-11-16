import mongoose from "mongoose";

const publicationLogSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  publishedAt: { type: Date, default: Date.now },
});

export const PublicationLog = mongoose.model("PublicationLog", publicationLogSchema);
