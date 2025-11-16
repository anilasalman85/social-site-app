import cron from "node-cron";
import { Post } from "../models/Post.js";
import { PublicationLog } from "../models/publicationModel.js";

export const startPostScheduler = () => {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    console.log("Scheduler running...");

    try {
      const now = new Date();

      // Find scheduled posts that need to be published
      const postsToPublish = await Post.find({
        status: "scheduled",
        scheduledAt: { $lte: now },
      }).sort({ createdAt: 1 }); // publish in order of creation

      for (let post of postsToPublish) {
        post.status = "published";
        await post.save();

        // Create a publication log
        await PublicationLog.create({ post: post._id, user: post.user,
            publishedAt :new Date(),
        });
        console.log(`Post ${post._id} published`);
      }

      if (postsToPublish.length === 0) {
        console.log("No posts to publish at this time.");
      }
    } catch (err) {
      console.error("Scheduler error:", err.message);
    }
  });
};
