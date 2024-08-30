import React, { useState } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Edit,
  Delete,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  TextField,
  Button,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state";
import { BACKEND_URL } from "../../config";
import { format } from 'date-fns';

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
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      const response = await fetch(`${BACKEND_URL}/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, comment: newComment }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/posts/${postId}/comment/${commentId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, comment: editedComment }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setEditingCommentId(null);
      setEditedComment("");
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      const response = await fetch(`${BACKEND_URL}/posts/${postId}/comment/${commentToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
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
          src={`${BACKEND_URL}/assets/${picturePath}`}
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
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    sx={{ mr: 1 }}
                  />
                  <Button onClick={() => handleEditComment(comment._id)}>Save</Button>
                  <Button onClick={() => setEditingCommentId(null)}>Cancel</Button>
                </FlexBetween>
              ) : (
                <FlexBetween>
                  <Box display="flex" alignItems="center">
                    <Avatar src={`${BACKEND_URL}/assets/${comment.userPicturePath}`} sx={{ width: 32, height: 32, mr: 1 }} />
                    <Box>
                      <Typography sx={{ color: main, fontWeight: "bold" }}>
                        {comment.firstName} {comment.lastName}
                      </Typography>
                      <Typography sx={{ color: main }}>{comment.comment}</Typography>
                      <Typography variant="caption" sx={{ color: palette.neutral.medium }}>
                        {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                        {comment.isEdited && " (edited)"}
                      </Typography>
                    </Box>
                  </Box>
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

      {/* Confirmation Dialog for Comment Deletion */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Comment Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteComment} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </WidgetWrapper>
  );
};

export default PostWidget;
