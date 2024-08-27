import { Box, useMediaQuery, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import FriendListWidget from "../widgets/FriendListWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import UserWidget from "../widgets/UserWidget";
import { BACKEND_URL } from "../../config";
import { setPosts } from "../../state";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const posts = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();

  const getUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching user data for ID: ${userId}`);
      console.log(`Using token: ${token.substring(0, 10)}...`);
      console.log(`Full URL: ${BACKEND_URL}/users/${userId}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log(`Response status: ${response.status}`);
      console.log(`Response OK: ${response.ok}`);
      if (!response.ok) {
        const errorBody = await response.text();
        console.log(`Error body: ${errorBody}`);
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched user data:", data);
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setError(error.name === 'AbortError' ? 'Request timed out' : error.message);
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    console.log("ProfilePage useEffect triggered");
    getUser();
    return () => {
      console.log("ProfilePage useEffect cleanup");
    };
  }, [getUser]);

  useEffect(() => {
    console.log("Current posts in Redux store:", posts);
  }, [posts]);

  console.log("ProfilePage render", { loading, error, user, postsCount: posts.length });

  if (loading) return <CircularProgress />;
  if (error) {
    return (
      <Box>
        <Typography color="error">Error: {error}</Typography>
        <button onClick={() => navigate('/')}>Go back to home</button>
      </Box>
    );
  }
  if (!user) return <Typography>No user data available</Typography>;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={user._id} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget userId={user._id} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <PostsWidget userId={user._id} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
