// src/routes/postRoutes.js
import express from "express";
import { body } from "express-validator";
import {protect} from "../middlewares/authMiddleware.js"
import {
  getPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";


const router = express.Router();

router.use(protect); 

router.get("/", getPost);         
router.get("/:id", getPostById);  
router.post("/",body("content").trim().escape().isLength({ max: 500 }),
body("platforms").isArray(),
body("scheduledAt").isISO8601(), createPost);      
router.put("/:id", updatePost);    
router.delete("/:id", deletePost); 

export default router;
