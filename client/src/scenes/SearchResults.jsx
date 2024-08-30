import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../components/Friend";
import WidgetWrapper from "../components/WidgetWrapper";
import PostWidget from "widgets/PostWidget";

const SearchResults = () => {
  const { palette } = useTheme();
  const searchResults = useSelector((state) => state.searchResults);
  const loggedInUserId = useSelector((state) => state.user._id);

  return (
    <Box width="100%" padding="2rem 6%">
      <Typography variant="h4" mb={2}>Search Results</Typography>
      
      <Typography variant="h5" mb={1}>Users</Typography>
      {searchResults.users && searchResults.users.map((user) => (
        <WidgetWrapper key={user._id} m="0 0 1rem 0">
          <Friend
            friendId={user._id}
            name={`${user.firstName} ${user.lastName}`}
            subtitle={user.occupation}
            userPicturePath={user.picturePath}
          />
        </WidgetWrapper>
      ))}

      <Typography variant="h5" mb={1} mt={2}>Posts</Typography>
      {searchResults.posts && searchResults.posts.map((post) => (
        <PostWidget
          key={post._id}
          postId={post._id}
          postUserId={post.userId._id}
          name={`${post.userId.firstName} ${post.userId.lastName}`}
          description={post.description}
          location={post.location}
          picturePath={post.picturePath}
          userPicturePath={post.userId.picturePath}
          likes={post.likes}
          comments={post.comments}
          loggedInUserId={loggedInUserId}
        />
      ))}
    </Box>
  );
};

export default SearchResults;
