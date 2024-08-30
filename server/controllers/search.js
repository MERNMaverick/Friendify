import User from "../models/User.js";
import Post from "../models/Post.js";

export const searchUsersAndPosts = async (req, res) => {
  try {
    const { q } = req.query;
    
    // Search for users
    const users = await User.find({
      $or: [
        { firstName: { $regex: q, $options: "i" } },
        { lastName: { $regex: q, $options: "i" } },
      ]
    }).select("-password");

    // Search for posts
    const posts = await Post.find({
      $or: [
        { description: { $regex: q, $options: "i" } },
        { "comments.comment": { $regex: q, $options: "i" } }
      ]
    }).populate("userId", "firstName lastName picturePath");

    res.json({ users, posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
