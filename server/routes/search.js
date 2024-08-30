import express from "express";
import { searchUsersAndPosts } from "../controllers/search.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, searchUsersAndPosts);

export default router;
