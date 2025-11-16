import {Post} from "../models/Post.js";
import { PublicationLog } from "../models/publicationModel.js";
export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalPosts = await Post.countDocuments({ user: userId });
    const scheduledCount = await Post.countDocuments({ user: userId, status: "scheduled" });
    const publishedCount = await Post.countDocuments({ user: userId, status: "published" });

    const postsByPlatform = await Post.aggregate([
      { $match: { user: userId } },
      { $unwind: "$platforms" },
      { $group: { _id: "$platforms", count: { $sum: 1 } } }
    ]);

    res.json({ totalPosts, scheduledCount, publishedCount, postsByPlatform });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUpcoming = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const upcomingPosts = await Post.find({ 
      user: userId, 
      status: "scheduled", 
      scheduledAt: { $gte: now } 
    })
    .sort({ scheduledAt: 1 })
    .limit(5)
    .lean();

    res.json({ upcomingPosts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
