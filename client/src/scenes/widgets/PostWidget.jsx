import React, { useState } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Edit,
  Delete,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
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
  const [editedCommentText, setEditedCommentText] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
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
      body: JSON.stringify({ userId: loggedInUserId, comment: editedCommentText }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setEditingCommentId(null);
      setEditedCommentText("");
    } else {
      console.error("Failed to edit comment:", await response.text());
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    const response = await fetch(`https://friendify-backend-api.onrender.com/posts/${postId}/comment/${commentToDelete._id}`, {
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
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    } else {
      console.error("Failed to delete comment:", await response.text());
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        isFriend={postUserId !== loggedInUserId}
        disableFriendAction={postUserId === loggedInUserId}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`https://friendify-backend-api.onrender.com/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment) => (
            <Box key={comment._id}>
              <Divider />
              {editingCommentId === comment._id ? (
                <FlexBetween>
                  <TextField
                    fullWidth
                    value={editedCommentText}
                    onChange={(e) => setEditedCommentText(e.target.value)}
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
                          setEditedCommentText(comment.comment);
                        }}>
                          <Edit />
                        </IconButton>
                      )}
                      <IconButton onClick={() => {
                        setCommentToDelete(comment);
                        setDeleteDialogOpen(true);
                      }}>
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
      <Dialog
        open={deleteDialogOpen
