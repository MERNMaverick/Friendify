import Post from '../models/Post.js'

// CREATE NEW POST
export const createPost = async (req,res) => {
    try{

        const {userId, description, picturePath} = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({userId, firstname: user.firstname, lastname: user.lastname, location: user.location, description, userPicturePath: user.picturePath, picturePath, likes:{}, comments:[]})
    
        await newPost.save
        const post = await Post.find()
        res.status(201).json(post)
    
    }
    catch(err){
        return res.status(409).json({error: err.message})
    }
}

// READ POSTS
export const getFeedPosts = async (req, res) => {
    try{
        const posts = await Post.find().sort({createdAt: -1})
        res.status(200).json(posts)
    }
    catch(err){
        return res.status(404).json({error: err.message})
    }
}

export const getUserPosts = async (req, res) => {
    try{
        const {userId} = req.params;
        const posts = await Post.find({userId}).sort({createdAt: -1})
        res.status(200).json(posts)
    }
    catch(err){
        return res.status(404).json({error: err.message})
    }
}

// UPDATE COMMENT
export const likePost = async(req,res) => {
    try{
        const {id} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        
        if(isLiked){
            post.likes.delete(userId);
        }
        else{
            post.likes.set(userId, true);
        }
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new: true}
        )
        res.status(200).json(updatedPost)
    }
    catch(err){
        return res.status(404).json({error: err.message})
    }
}