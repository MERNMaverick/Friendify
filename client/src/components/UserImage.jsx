import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  // Check if path starts with 'http' or 'https', return it as is
  const getImageUrl = (path) => {
    return path.startsWith('http') ? path : `https://friendify-backend-api.onrender.com/assets/${path}`;
  };

  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={getImageUrl(image)}
      />
    </Box>
  );
};

export default UserImage;
