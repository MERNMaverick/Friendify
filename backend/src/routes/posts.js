import express from 'express';
import {getFeedPosts, getUserPosts, likePost} from '../controller/posts.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// READ ROUTE
router.get('/', verifyToken, getFeedPosts);
router.get('/:userId/posts', verifyToken, getUserPosts);


// UPDATE ROUTE
router.patch('/:id/like', verifyToken, likePost);

export default router;