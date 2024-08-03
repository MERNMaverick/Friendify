import express from 'express';
import { getUser, getUserFriends, addRemoveFriend} from "../controller/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET ROUTES
router.get('/:id', verifyToken, getUser);
router.get('/:id/friends', verifyToken, getUserFriends);

// UPDATE ROUTES
router.patch('/:id:friendId', verifyToken, addRemoveFriend)

export default router;