import React, { useState } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Edit,
  Delete,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, TextField, Button } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost, editComment, deleteComment } from "../../state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  loggedInUserId,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`https://friendify-backend-api.onrender.com/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    const response = await fetch(`https://friendify-backend-api.onrender.com/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, comment: newComment }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setNewComment("");
    } else {
      console.error("Failed to add comment:", await response.text());
    }
  };

  const handleEditComment = async (commentId) => {
    const response = await fetch(`https://friendify-backend-api.onrender.com/posts/${postId}/comment/${commentId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, comment: editedComment }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setEditingCommentId(null);
      setEditedComment("");
    } else {
      console.error("Failed to edit comment:", await response.text());
    }
  };

  const handleDeleteComment = async (commentId) => {
    const response = await fetch(`https://friendify-backend-api.onrender.com/posts/${postId}/comment/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } else {
      console.error("Failed to delete comment:", await response.text());
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      {/* ... existing Friend and post content ... */}
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment) => (
            <Box key={comment._id}>
              <Divider />
              {editingCommentId === comment._id ? (
                <FlexBetween>
                  <TextField
                    fullWidth
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    sx={{ mr: 1 }}
                  />
                  <Button onClick={() => handleEditComment(comment._id)}>Save</Button>
                  <Button onClick={() => setEditingCommentId(null)}>Cancel</Button>
                </FlexBetween>
              ) : (
                <FlexBetween>
                  <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                    <strong>{comment.firstName} {comment.lastName}:</strong> {comment.comment}
                  </Typography>
                  {(comment.userId === loggedInUserId || postUserId === loggedInUserId) && (
                    <FlexBetween>
                      {comment.userId === loggedInUserId && (
                        <IconButton onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditedComment(comment.comment);
                        }}>
                          <Edit />
                        </IconButton>
                      )}
                      <IconButton onClick={() => handleDeleteComment(comment._id)}>
                        <Delete />
                      </IconButton>
                    </FlexBetween>
                  )}
                </FlexBetween>
              )}
            </Box>
          ))}
          <Divider />
          <FlexBetween>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mr: 1 }}
            />
            <Button variant="contained" onClick={handleAddComment}>
              Post
            </Button>
          </FlexBetween>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
