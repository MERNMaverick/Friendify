import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  // Function to handle both absolute and relative URLs
  const getImageUrl = (path) => {
    // Check if path starts with 'http', if so, return it as is
    if (path.startsWith('http')) {
      return path;
    }
    // Otherwise, construct a URL with the base path
    return `https://friendify-backend-api.onrender.com/assets/${path}`;
  };

  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={getImageUrl(image)}  // Use the getImageUrl function to handle paths
      />
    </Box>
  );
};

export default UserImage;
