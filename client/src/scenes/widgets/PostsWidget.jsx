import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import PostWidget from "./PostWidget";
import { Box, Typography, CircularProgress } from "@mui/material";
import { BACKEND_URL } from "../../config";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserPosts = async () => {
    try {
      setLoading(true);
      console.log(`Fetching posts for user ${userId}`);
      const response = await fetch(`${BACKEND_URL}/posts/${userId}/posts`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Fetched posts for user ${userId}:`, data);
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error(`Failed to fetch posts for user ${userId}:`, error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("PostsWidget useEffect triggered", { isProfile, userId });
    if (isProfile) {
      getUserPosts();
    }
  }, [userId, isProfile]);

  console.log("PostsWidget render", { loading, error, postsCount: posts.length });

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading posts: {error}</Typography>;
  if (posts.length === 0) return <Typography>No posts to display.</Typography>;

  return (
    <Box>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </Box>
  );
};

export default PostsWidget;
