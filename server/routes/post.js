import express from "express";
import { addComment,editComment, deleteComment, getFeedPosts, getUserPosts, likePost } from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.post("/:id/comment", verifyToken, addComment);
router.patch("/:id/comment/:commentId", verifyToken, editComment);
router.delete("/:id/comment/:commentId", verifyToken, deleteComment);

export default router;
