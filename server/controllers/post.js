import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const picturePath = req.file ? req.file.filename : null; // Handle optional file
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description, 
      userPicturePath: user.picturePath,
      picturePath, // This can be null if no picture is uploaded
      likes: {},
      comments: [],
    });

    await newPost.save();
    const posts = await Post.find();
    res.status(201).json(posts);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* Edit and delete comment */
export const editComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { userId, comment } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const commentToEdit = post.comments.id(commentId);
    if (!commentToEdit) return res.status(404).json({ message: "Comment not found" });

    if (commentToEdit.userId.toString() !== userId) {
      return res.status(403).json({ message: "User not authorized to edit this comment" });
    }

    commentToEdit.comment = comment;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const commentToDelete = post.comments.id(commentId);
    if (!commentToDelete) return res.status(404).json({ message: "Comment not found" });

    if (commentToDelete.userId.toString() !== userId && post.userId.toString() !== userId) {
      return res.status(403).json({ message: "User not authorized to delete this comment" });
    }

    post.comments.pull(commentId);
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  const startTime = Date.now();
  try {
    const { userId } = req.params;
    console.log(`[${startTime}] Fetching posts for userId: ${userId}`);
    
    // Convert userId string to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    const posts = await Post.find({ userId: userObjectId });
    console.log(`[${Date.now()}] Found ${posts.length} posts for userId: ${userId}`);
    
    if (posts.length === 0) {
      console.log(`[${Date.now()}] No posts found for userId: ${userId}`);
    }

    const endTime = Date.now();
    console.log(`[${endTime}] Request completed in ${endTime - startTime}ms`);
    
    res.status(200).json(posts);
  } catch (err) {
    const endTime = Date.now();
    console.error(`[${endTime}] Error fetching posts for userId: ${req.params.userId}`, err);
    console.log(`Request failed after ${endTime - startTime}ms`);
    res.status(500).json({ message: err.message });
  }
};

/* ADD COMMENT */
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      comment: comment,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
