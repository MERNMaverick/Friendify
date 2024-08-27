import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ... existing reducers ...

    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((post) => post._id === postId);
      if (post) {
        post.comments.push(comment);
      }
    },
    editComment: (state, action) => {
      const { postId, commentId, newComment } = action.payload;
      const post = state.posts.find((post) => post._id === postId);
      if (post) {
        const comment = post.comments.find((comment) => comment._id === commentId);
        if (comment) {
          comment.comment = newComment;
        }
      }
    },
    deleteComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const post = state.posts.find((post) => post._id === postId);
      if (post) {
        post.comments = post.comments.filter((comment) => comment._id !== commentId);
      }
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  addComment,
  editComment,
  deleteComment,
} = authSlice.actions;

export default authSlice.reducer;
